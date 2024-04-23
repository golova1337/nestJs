import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '../enum/status-project-enum';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty({ type: String, example: 'ToDoList' })
  @ApiPropertyOptional()
  @IsOptional()
  title: string;

  @ApiProperty({ type: String, example: 'your description' })
  @ApiPropertyOptional()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Array of objects with name and description properties',
    example: [{ name: 'task1', description: 'description task' }],
  })
  @ApiPropertyOptional()
  @IsOptional()
  task: { name: string; description: string }[];

  @ApiProperty({
    description: 'Status of the item',
    enum: Status,
    example: Status.InProgress,
  })
  @ApiPropertyOptional()
  status: Status;
}
