import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRepository } from './repository/projectRepository';
import { duplicateName } from './helpers/checkProjectName';
import { EmojiLogger } from 'src/utils/logger/LoggerService';
import { isEmptyObj } from './helpers/isEmptyObj';

@Injectable()
export class ProjectService {
  private readonly logger = new EmojiLogger();

  constructor(private projectRepository: ProjectRepository) {}

  async create(data: CreateProjectDto) {
    // check-Duplicate-Projects
    const projects = await this.projectRepository
      .checkProjectName(data.userId)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Servers');
      });
    // run helper chek duplicate-sName
    const result = duplicateName(projects, data.title);

    // check-count-projects
    if (result.length >= 2) {
      throw new BadRequestException(
        'You can not have more two projects with the same title',
      );
    }

    // create-projects
    const newProject = await this.projectRepository
      .create(data)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Servers');
      });

    return {
      massage: 'Create projects Successfully',
      id: data.userId,
      meta: {
        project: {
          id: newProject._id,
          title: newProject.title,
          description: newProject.description,
          status: newProject.status,
        },
      },
    };
  }

  async findAll(condition) {
    //destructurisation

    let { page, perPage, userId, sortField, sortOrder, ...filters } = condition;
    //data handling SORT
    let sortQuery = {};
    sortField = sortField || 'createdAt';
    sortQuery[sortField] = sortOrder === 'asc' ? 1 : -1;

    //Pagination
    page = parseInt(page) || 1;
    perPage = parseInt(perPage) || 10;

    // filter Filters
    filters = isEmptyObj(filters);

    // run repo
    const data = { userId, page, perPage, sortQuery, filters };
    const projects = await this.projectRepository.findAll(data).catch((err) => {
      this.logger.error(err);
      throw new InternalServerErrorException('InternalServer');
    });

    //return
    return {
      massage: 'Get projects Successfully',
      id: userId,
      meta: {
        projects,
        page,
        perPage,
      },
    };
  }

  async findOne(id: string) {
    // run repo
    const project = await this.projectRepository.findOne(id);

    // check whether the project exist
    if (!project) throw new NotFoundException('Project does not exist');
    //return response
    return {
      message: 'Get one by id succesfully',
      meta: {
        project: project,
      },
    };
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    //update
    const update = await this.projectRepository.update(id, updateProjectDto);

    //return response
    return {
      message: 'Update by id succesfully',
      meta: {
        project: update,
      },
    };
  }

  async remove(userId: string, ids: string[]) {
    const deleted = await this.projectRepository.remove(ids);
    console.log(deleted);

    return {
      message: 'Deleted succesfully',
      id: userId,
      meta: {
        removed: deleted.deletedCount,
        ids_projects: ids,
      },
    };
  }
}