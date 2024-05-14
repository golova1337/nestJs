import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ required: true, example: 'task 1', name: 'title' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'description task',
    name: 'description',
    required: false,
  })
  @ApiPropertyOptional()
  @IsOptional()
  description?: string;
}
