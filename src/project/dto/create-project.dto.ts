import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateProjectDto {
  //title
  @ApiProperty({
    example: 'My project',
    description: 'You can not have two projects with the same name',
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
}
