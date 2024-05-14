import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '../enum/status-enum';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty({ type: String, example: 'ToDoList', name: 'title' })
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @ApiProperty({
    type: String,
    example: 'your description',
    name: 'description',
  })
  @ApiPropertyOptional()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Status of the item, available [ToDo,InProgress,Done]',
    enum: Status,
    example: Status.InProgress,
    name: 'status',
    default: Status.ToDo,
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Status)
  status?: Status = Status.ToDo;
}
