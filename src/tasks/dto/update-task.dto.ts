import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsDefined, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Priority } from '../../project/enum/priority-task-enum';
import { Status } from 'src/project/enum/status-enum';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({ required: true, example: 'task 1' })
  @IsNotEmpty()
  @IsDefined()
  title?: string;

  @ApiProperty({ example: 'description task' })
  @ApiPropertyOptional()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Status of the item, available [ToDo,InProgress,Done]',
    enum: Status,
    example: Status.InProgress,
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Status)
  status?: Status = Status.ToDo;

  @ApiProperty({
    description:
      'Status of the item, available [Very Low,Low, Medium, High, Highest]',
    enum: Priority,
    example: Priority.Medium,
    default: Priority.Medium,
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority = Priority.Medium;
}
