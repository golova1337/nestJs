import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  Project,
  ProjectDocument,
  Task,
} from 'src/project/entities/project.entities';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(
    projectId: string,
    createTaskDto: CreateTaskDto,
  ): Promise<Project> {
    return this.projectModel.findByIdAndUpdate(
      projectId,
      {
        $push: { tasks: createTaskDto },
      },
      { new: true, lean: true, select: { tasks: 1 } },
    );
  }

  async findAll(
    projectId: string,
    sortQuery,
    userId: string,
  ): Promise<Task[] | []> {
    return await this.projectModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(projectId),
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      { $unwind: '$tasks' },
      { $sort: { [`tasks.${sortQuery.sortField}`]: sortQuery.sortOrder } },
      {
        $project: { tasks: 1 },
      },
    ]);
  }

  async findOne(data: {
    taskId: string;
    projectId: string;
    userId: string;
  }): Promise<Project | null> {
    return await this.projectModel.findOne(
      {
        _id: data.projectId,
        userId: data.userId,
      },
      { tasks: { $elemMatch: { _id: data.taskId } } },
    );
  }

  async update(
    taskId: string,
    projectId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Project | null> {
    return await this.projectModel.findOneAndUpdate(
      { _id: projectId, tasks: { $elemMatch: { _id: taskId } } },
      {
        $set: {
          'tasks.$.title': updateTaskDto.title,
          'tasks.$.description': updateTaskDto.description,
          'tasks.$.status': updateTaskDto.status,
          'tasks.$.priority': updateTaskDto.priority,
        },
      },
      {
        new: true,
        select: { tasks: { $elemMatch: { _id: taskId } } },
      },
    );
  }

  async remove(params: { taskId: string; projectId: string }): Promise<any> {
    const { taskId, projectId } = params;
    return await this.projectModel.findOneAndUpdate(
      { _id: projectId },
      { $pull: { tasks: { _id: taskId } } },
    );
  }

  async assignee(data: {
    userId: string;
    assignee: string;
    params: { taskId: string; projectId: string };
  }): Promise<Project | null> {
    return await this.projectModel.findOneAndUpdate(
      {
        _id: data.params.projectId,
        userId: data.userId,
        collaborations: { $in: [data.assignee] },
        tasks: { $elemMatch: { _id: data.params.taskId } },
      },
      {
        $set: {
          'tasks.$.assignee': data.assignee,
        },
      },
      {
        new: true,
        select: { tasks: { $elemMatch: { _id: data.params.taskId } } },
      },
    );
  }
}
