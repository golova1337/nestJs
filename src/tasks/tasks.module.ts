import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { Project, ProjectSchema } from 'src/project/entities/project.entities';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectRepository } from 'src/project/repository/project.repository';
import { TaskRepository } from './repository/tasks.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [TasksController],
  providers: [TasksService, ProjectRepository, TaskRepository],
})
export class TasksModule {}
