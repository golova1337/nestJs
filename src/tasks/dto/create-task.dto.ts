import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ required: true, example: 'task 1' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'description task' })
  @ApiPropertyOptional()
  @IsOptional()
  description?: string;
}
