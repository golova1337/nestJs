import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Status } from '../enum/status-project-enum';
import { Priority } from '../enum/status-task-enum';

@Schema()
export class Task {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String, enum: Status, default: Status.ToDo })
  status: Status;

  @Prop({
    type: [{ type: [String], ref: 'User' }],
    default: ['Unassigned'],
  })
  assignee: Array<string>;

  @Prop({ type: String, enum: Priority, default: Priority.Medium })
  priority: Priority;
}
export const TaskSchema = SchemaFactory.createForClass(Task);
