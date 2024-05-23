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
import { Project } from '../entities/project.entities';
import { sort } from '../helpers/sortField-Order';
import { pagination } from '../helpers/pagination ';
import { QueryFindAllProjects } from '../interface/queryFindAllProjects-interface';
import { Field, Order } from '../enum/sort-enum';

@Injectable()
export class ProjectService {
  private readonly logger = new EmojiLogger();
  constructor(private readonly projectRepository: ProjectRepository) {}

  async create(
    data: CreateProjectDto,
    userId: string,
  ): Promise<{ data: { project: Project } }> {
    //check-Duplicate-Projects
    const projects: Project[] = await this.projectRepository
      .find(userId, data.title)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Server Error');
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
      data: { project },
    };
  }

  async findAll(
    condition: Partial<QueryFindAllProjects>,
    userId: string,
  ): Promise<{ data: { projects: Project[] | [] }; meta: object }> {
    //destructurisation
    let { page, perPage, sortBy, sortOrder, ...filters } = condition;

    //condition of sort, field and order ascending, descending
    const sorting: { sortBy: Field; sortOrder: Order } = sort({
      sortBy,
      sortOrder,
    });

    //Pagination
    const pagin: { page: number; perPage: number } = pagination(page, perPage);
    // filter Filters
    filters['userId'] = userId;
    filters = isEmptyObj(filters);

    console.log(filters);

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
      data: { projects },
      meta: {
        all_Projects: projects.length,
        first_Page: 1,
        last_Page: Math.ceil(projects.length / +perPage),
        page,
        perPage,
      },
    };
  }

  async findOne(data: {
    userId: string;
    projectId: string;
  }): Promise<{ data: { project: Project } }> {
    // run repo
    const project: Project | null = await this.projectRepository
      .findOne(data)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Server Error');
      });
    if (!project) {
      throw new NotFoundException('Not found');
    }

    //return response
    return {
      data: { project },
    };
  }

  async update(
    userId: string,
    id: string,
    update: UpdateProjectDto,
  ): Promise<{ data: { project: Project } }> {
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
      data: { project },
    };
  }

  async remove(userId: string, ids: string[]): Promise<void> {
    await this.projectRepository.remove(ids, userId).catch((err) => {
      this.logger.error(err);
      throw new InternalServerErrorException('Internal Server Error');
    });
  }
}
