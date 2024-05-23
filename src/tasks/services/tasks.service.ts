import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskRepository } from '../repository/tasks.repository';
import { sort } from '../../project/helpers/sortField-Order';
import { EmojiLogger } from 'src/utils/logger/LoggerService';
import { Project, Task } from 'src/project/entities/project.entities';
import { Sorting } from 'src/project/interface/queryFindAllProjects-interface';

@Injectable()
export class TasksService {
  private readonly logger = new EmojiLogger();
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(
    createTaskDto: CreateTaskDto,
    projectId: string,
  ): Promise<{ data: { task: Task } }> {
    // run repository
    const task = await this.taskRepository
      .create(projectId, createTaskDto)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Server Error');
      });
    return {
      data: { task: task.tasks[task.tasks.length - 1] },
    };
  }

  async findAll(data: {
    projectId: string;
    sort: Sorting;
    userId: string;
  }): Promise<{ data: { tasks: Task[] | [] } }> {
    //condition of sort, field and order ascending, descending
    let { sortBy, sortOrder } = data.sort;
    const sortQuery = sort({ sortBy, sortOrder });
    // run repository
    const tasks: Task[] | [] = await this.taskRepository
      .findAll(data.projectId, sortQuery, data.userId)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Server Error');
      });

    // return
    return {
      data: { tasks },
    };
  }

  async findOne(data: {
    taskId: string;
    projectId: string;
    userId: string;
  }): Promise<{ data: { task: Task } }> {
    // run repository
    const task: Project | null = await this.taskRepository
      .findOne(data)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Server Error');
      });

    // return
    return {
      data: { task: task.tasks[0] },
    };
  }

  async update(
    taskId: string,
    projectId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<{ data: { task: Task } }> {
    // run repository
    const task: Project | null = await this.taskRepository
      .update(taskId, projectId, updateTaskDto)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Server Error');
      });

    // return
    return {
      data: { task: task.tasks[0] },
    };
  }

  async remove(params: { taskId: string; projectId: string }): Promise<void> {
    // run repository
    await this.taskRepository.remove(params).catch((err) => {
      this.logger.error(err);
      throw new InternalServerErrorException('Internal Server Error');
    });
  }

  async assignee(data: {
    userId: string;
    assignee: string;
    params: { taskId: string; projectId: string };
  }) {
    // run repository
    const task: Project | null = await this.taskRepository
      .assignee(data)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Server Error');
      });

    // return
    return {
      data: { task: task.tasks },
    };
  }
}
