import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectRepository } from '../repository/project.repository';
import { EmojiLogger } from 'src/utils/logger/LoggerService';
import { isEmptyObj } from '../helpers/isEmptyObj';
import { SettingsProjectService } from './setting-project.service';
import { Project } from '../entities/project.entities';
import { sort } from '../helpers/sortField-Order';
import { pagination } from '../helpers/pagination ';

@Injectable()
export class ProjectService {
  private readonly logger = new EmojiLogger();
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly settingProject: SettingsProjectService,
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
    console.log(project);

    // return
    return {
      massage: 'Create projects Successfully',
      project,
      meta: {},
    };
  }

  async findAll(condition): Promise<any> {
    //destructurisation
    let { page, perPage, sortField, sortOrder, ...filters } = condition;

    //condition of sort, field and order ascending, descending
    const sorting = sort(sortField, sortOrder);
    //Pagination
    const pagin = pagination(page, perPage);
    // filter Filters
    filters = isEmptyObj(filters);

    // run repository
    const data = { pagin, sorting, filters };

    const projects: Project[] | [] = await this.projectRepository
      .findAll(data)
      .catch((err) => {
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

  async findOne(data: { userId: string; projectId: string }): Promise<any> {
    // run repo
    const project: Project | null = await this.projectRepository
      .findOne(data)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Server Error');
      });

    //return response
    return {
      message: 'Get one by id succesfully',
      project,
      meta: {},
    };
  }

  async update(
    userId: string,
    id: string,
    update: UpdateProjectDto,
  ): Promise<any> {
    // run repository

    const project: Project | null = await this.projectRepository
      .update({ userId, id, update })
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Server Error');
      });

    if (!project) {
      throw new NotFoundException('Not Found');
    }

    //return response
    return {
      message: 'Update by id succesfully',
      project,
      meta: {},
    };
  }

  async remove(userId: string, ids: string[]): Promise<any> {
    const deleted = await this.projectRepository.remove(ids, userId);
    if (!deleted.deletedCount) {
      throw new BadRequestException('You do not have access to remove it');
    }

    return {
      message: 'Deleted succesfully',
      id: userId,
      removed: deleted.deletedCount,
      ids_projects: ids,
      meta: {},
    };
  }
}
