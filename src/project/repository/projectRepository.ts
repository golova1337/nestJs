import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from '../model/project.schema';
import { Model } from 'mongoose';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectRepository {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(data) {
    const newProject = new this.projectModel(data);
    return await newProject.save();
  }

  async findByIdAndTitle(userId: string, title: string) {
    return await this.projectModel.find({ userId: userId, title: title });
  }

  async findAll(data): Promise<CreateProjectDto[]> {
    return await this.projectModel
      .find({ userId: data.userId, ...data.filters })
      .sort(data.sortQuery)
      .skip((data.page - 1) * data.perPage)
      .limit(data.perPage);
  }

  async findOne(id: string): Promise<CreateProjectDto> {
    return await this.projectModel.findById(id);
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<CreateProjectDto> {
    return await this.projectModel.findByIdAndUpdate(
      id,
      {
        ...updateProjectDto,
        updateAt: Date.now(),
      },
      { new: true },
    );
  }

  async remove(ids: string[]) {
    return await this.projectModel.deleteMany({ _id: { $in: ids } });
  }
}
