import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from '../model/project.schema';
import { Model } from 'mongoose';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectRepository {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(data: Project): Promise<Project> {
    const newProject = new this.projectModel(data);

    return await newProject.save();
  }

  async findByIdAndTitle(userId: string, title: string) {
    return await this.projectModel.find({ userId: userId, title: title });
  }

  async findAll(data): Promise<Project[]> {
    //destructurisation
    const { pagin, sorting, filters } = data;
    return await this.projectModel
      .find({ ...filters })
      .sort(sorting)
      .skip((pagin.page - 1) * data.perPage)
      .limit(pagin.perPage);
  }

  async findOne(id: string): Promise<Project> {
    return await this.projectModel.findById(id);
  }

  async update(id: string, update: UpdateProjectDto): Promise<Project> {
    return await this.projectModel.findByIdAndUpdate(
      id,
      {
        ...update,
      },
      { new: true },
    );
  }

  async remove(ids: string[]) {
    return await this.projectModel.deleteMany({ _id: { $in: ids } });
  }

  async addCollaborate(projectId: string, collaborator: string): Promise<any> {
    return await this.projectModel.findByIdAndUpdate(
      { _id: projectId },
      {
        $push: { colaboration: collaborator },
      },
      { new: true },
    );
  }
}
