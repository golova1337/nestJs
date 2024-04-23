import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'My project',
    description: 'You can not create two projects with the same name',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'my first project',
  })
  @ApiPropertyOptional()
  @IsOptional()
  description: string;
}
