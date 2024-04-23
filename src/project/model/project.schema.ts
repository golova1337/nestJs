import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Status } from '../enum/status-project-enum';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [{ name: String, description: String }] })
  task: [{ name: string; description: string }];

  @Prop({ default: Date.now }) // Устанавливаем значение по умолчанию на текущую дату и время
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updateAt: Date;

  @Prop({
    enum: Status,
    default: Status.ToDo,
  })
  status: Status;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
