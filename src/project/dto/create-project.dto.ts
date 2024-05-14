import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateProjectDto {
  //title
  @ApiProperty({
    example: 'My first project',
    description: 'You can not have two projects with the same name',
    name: 'title',
  })
  @IsNotEmpty()
  title: string;

  //description
  @ApiProperty({
    example: 'It is my first project',
    name: 'description',
  })
  @ApiPropertyOptional()
  @IsOptional()
  description?: string;
}
