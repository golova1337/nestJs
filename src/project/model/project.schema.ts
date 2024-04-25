import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Status } from '../enum/status-project-enum';
import { Task, TaskSchema } from './task.schema';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [TaskSchema] })
  task: Task[];

  @Prop({ default: Date.now }) // Устанавливаем значение по умолчанию на текущую дату и время
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({
    type: String,
    enum: Status,
    default: Status.ToDo,
  })
  status: Status;

  @Prop({ type: [String], ref: 'User' })
  colaboration: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
