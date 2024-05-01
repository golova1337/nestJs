import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '../enum/status-project-enum';
import { Task } from '../model/task.schema';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty({ type: String, example: 'ToDoList' })
  @ApiPropertyOptional()
  @IsOptional()
  title?: string;

  @ApiProperty({ type: String, example: 'your description' })
  @ApiPropertyOptional()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: [
      {
        name: 'the task2',
        descriptio: 'my second description',
        status: 'ToDo',
        assignee: ['dima@gmail.com'],
        priority: 'Medium',
      },
    ],
    description:
      'You can create Tasks, the field "name" - Obligatory, you can add such fields "description: string"; "status: Enum[ToDo, InProgress, Done]"; "assignee: string[]"; "priority: Enum[Very Low, Low, Medium, High, Highest]',
  })
  @ApiPropertyOptional()
  @IsOptional()
  task?: Task[];

  @ApiProperty({
    description: 'Status of the item',
    enum: Status,
    example: Status.InProgress,
  })
  @ApiPropertyOptional()
  @IsOptional()
  status?: Status;
}
