import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskRepository } from '../repository/tasks.repository';
import { sort } from '../../project/helpers/sortField-Order';
import { EmojiLogger } from 'src/utils/logger/LoggerService';

@Injectable()
export class TasksService {
  private readonly logger = new EmojiLogger();
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(createTaskDto: CreateTaskDto, projectId: string) {
    // run repository
    const task = await this.taskRepository
      .create(projectId, createTaskDto)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Server Error');
      });
    return {
      message: 'The task has been created ',
      task,
      meta: {},
    };
  }

  async findAll(data: {
    projectId: string;
    sort: { sortField?: string; sortOrder: string };
    userId: string;
  }) {
    //condition of sort, field and order ascending, descending
    let { sortField, sortOrder } = data.sort;
    const sortQuery = sort(sortField, sortOrder);
    // run repository
    const tasks = await this.taskRepository
      .findAll(data.projectId, sortQuery, data.userId)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Server Error');
      });

    // return
    return {
      message: 'All tasks',
      tasks,
      meta: {},
    };
  }

  async findOne(data: { taskId: string; projectId: string; userId: string }) {
    // run repository
    let task = await this.taskRepository.findOne(data).catch((err) => {
      this.logger.error(err);
      throw new InternalServerErrorException('Internal Server Error');
    });
    // get only requested task
    task = task.tasks.find((task) => (task._id = data.taskId));

    // return
    return {
      message: 'one task',
      task,
      meta: {},
    };
  }

  async update(
    taskId: string,
    projectId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    // run repository
    const task = await this.taskRepository
      .update(taskId, projectId, updateTaskDto)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Server Error');
      });

    // return
    return {
      message: 'update task',
      task,
      meta: {},
    };
  }

  async remove(params: { taskId: string; projectId: string }) {
    // run repository
    const task = await this.taskRepository.remove(params).catch((err) => {
      this.logger.error(err);
      throw new InternalServerErrorException('Internal Server Error');
    });
    // return
    return {
      message: 'remove task',
      task,
      meta: {},
    };
  }

  async assignee(data: {
    userId: string;
    assignee: string;
    params: { taskId: string; projectId: string };
  }) {
    // run repository
    const task = await this.taskRepository.assignee(data).catch((err) => {
      this.logger.error(err);
      throw new InternalServerErrorException('Internal Server Error');
    });

    // return
    return {
      message: 'assignee succesfully',
      task,
      meta: {},
    };
  }
}
