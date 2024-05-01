import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectRepository } from '../repository/projectRepository';
import { EmojiLogger } from 'src/utils/logger/LoggerService';
import { isEmptyObj } from '../helpers/isEmptyObj';
import { SettingProject } from './setting-project.service';
import { Project } from '../model/project.schema';
import { sort } from '../helpers/sortField-Order';
import { pagination } from '../helpers/pagination ';
import { AccessProjectDto } from '../dto/access-project.dto';

@Injectable()
export class ProjectService {
  private readonly logger = new EmojiLogger();
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly settingProject: SettingProject,
  ) {}

  async create(data: CreateProjectDto, userId: string): Promise<any> {
    //check-Duplicate-Projects
    const projects = await this.projectRepository
      .findByIdAndTitle(userId, data.title)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Servers');
      });

    if (projects.length != 0) {
      throw new BadRequestException(
        'You can not have  two projects with the same title',
      );
    }

    // create project
    const project: Project = await this.projectRepository
      .create({ userId, ...data })
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Server Error');
      });

    // return
    return {
      massage: 'Create projects Successfully',
      id: userId,
      project,
      meta: {},
    };
  }

  async findAll(condition): Promise<any> {
    //destructurisation
    let { page, perPage, sortField, sortOrder, ...filters } = condition;

    //condition of sort
    const sorting = sort(sortField, sortOrder);
    //Pagination
    const pagin = pagination(page, perPage);
    // filter Filters
    filters = isEmptyObj(filters);

    // run repository
    const data = { pagin, sorting, filters };
    const projects = await this.projectRepository.findAll(data).catch((err) => {
      this.logger.error(err);
      throw new InternalServerErrorException('Internal Server Error');
    });

    //return
    return {
      massage: 'Get projects Successfully',
      id: filters.userId,
      projects,
      meta: {
        all_Projects: projects.length,
        first_Page: 1,
        last_Page: Math.ceil(projects.length / perPage),
        page,
        perPage,
      },
    };
  }

  async findOne(id: string): Promise<any> {
    // run repo
    const project = await this.projectRepository.findOne(id);

    // check whether the project exist
    if (!project) throw new NotFoundException('Project does not exist');
    //return response
    return {
      message: 'Get one by id succesfully',
      project,
      meta: {},
    };
  }

  async update(id: string, update: UpdateProjectDto): Promise<any> {
    // run repository
    const project = await this.projectRepository
      .update(id, update)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Server Error');
      });

    //return response
    return {
      message: 'Update by id succesfully',
      project,
      meta: {},
    };
  }

  async remove(userId: string, ids: string[]): Promise<any> {
    const deleted = await this.projectRepository.remove(ids);

    return {
      message: 'Deleted succesfully',
      id: userId,
      removed: deleted.deletedCount,
      ids_projects: ids,
      meta: {},
    };
  }

  async access(
    collaborators: AccessProjectDto,
    projectId: string,
  ): Promise<any> {
    // run settingProject service
    const result = await this.settingProject.access(collaborators, projectId);

    //return
    return {
      message: 'Collaborators were invited succesfully',
      collaborators: collaborators.colaboration,
      meta: {},
    };
  }

  async gainAccess(params: { projectId: string; invitationToken: string }) {
    // run settingProject service
    const result = await this.settingProject.gainAccess(params);
    console.log(result);

    // run project Repository
    const addCollaborate = await this.projectRepository.addCollaborate(
      params.projectId,
      result[0].email,
    );

    //return
    return {
      message: 'You have got access to project',
      meta: {},
    };
  }
}
