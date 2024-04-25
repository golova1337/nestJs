import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Status } from '../enum/status-project-enum';
import { Task } from '../model/task.schema';
export class CreateProjectDto {
  //title
  @ApiProperty({
    example: 'My project',
    description: 'You can not create two projects with the same name',
  })
  @IsNotEmpty()
  title: string;

  //description
  @ApiProperty({
    example: 'my first project',
  })
  @ApiPropertyOptional()
  @IsOptional()
  description?: string;

  //task []
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  task: Task[];

  //status Enum
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  status: Status;
}
