import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from '../entities/project.entities';
import { Model } from 'mongoose';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectRepository {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(project: Project): Promise<Project> {
    const newProject = new this.projectModel(project);

    return await newProject.save();
  }

  async findByIdAndTitle(userId: string, title: string) {
    return await this.projectModel.find({ userId: userId, title: title });
  }

  async findAll(data): Promise<Project[] | []> {
    //destructurisation
    const { pagin, sorting, filters } = data;

    return await this.projectModel
      .find(filters)
      .sort({ [sorting.sortField]: sorting.sortOrder })
      .skip((pagin.page - 1) * data.perPage)
      .limit(pagin.perPage);
  }

  async findOne(data: {
    userId: string;
    projectId: string;
  }): Promise<Project | null> {
    return await this.projectModel.findOne({
      _id: data.projectId,
      userId: data.userId,
    });
  }

  async update(data: {
    userId: string;
    id: string;
    update: UpdateProjectDto;
  }): Promise<Project | null> {
    return await this.projectModel.findOneAndUpdate(
      {
        _id: data.id,
        userId: data.userId,
      },
      {
        ...data.update,
      },
      { new: true },
    );
  }

  async remove(ids: string[], userId: string): Promise<any> {
    return await this.projectModel.deleteMany({
      _id: { $in: ids },
      userId: userId,
    });
  }

  async addCollaborate(projectId: string, collaborator: string): Promise<any> {
    return await this.projectModel.findByIdAndUpdate(
      projectId,
      {
        $addToSet: { collaboration: collaborator },
      },
      { new: true },
    );
  }
}
