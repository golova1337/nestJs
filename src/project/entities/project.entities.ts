import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Status } from '../enum/status-enum';
import { Priority } from 'src/project/enum/priority-task-enum';

export type ProjectDocument = Project & Document;

// task's schema
@Schema({
  timestamps: true,
  validateBeforeSave: true,
})
export class Task {
  @Prop({ type: String, required: true, trim: true })
  title: string;

  @Prop({ type: String, trim: true })
  description?: string;

  @Prop({ enum: Status, default: Status.ToDo })
  status?: Status;

  @Prop({
    type: String,
    default: 'Unassigned', // Используем функцию-генератор значения по умолчанию
    trim: true,
  })
  assignee?: string[];

  @Prop({ type: String, enum: Priority, default: Priority.Medium })
  priority?: Priority;
}

// Project's schema
@Schema({
  timestamps: true,
  validateBeforeSave: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Project {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: String, required: true, unique: true, trim: true })
  title: string;

  @Prop({ type: String, trim: true })
  description?: string;

  @Prop({ type: [Task], trim: true })
  tasks?: Task[];

  @Prop({
    type: String,
    enum: Status,
    default: Status.ToDo,
    trim: true,
  })
  status?: Status;

  @Prop({ type: [String], trim: true })
  collaboration?: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
