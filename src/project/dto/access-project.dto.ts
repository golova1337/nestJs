import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class AccessProjectDto {
  //colaboration
  @ApiProperty({
    example: ['dima@gmail.com'],
    description: 'colaborator, add by email only register user',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail({}, { each: true })
  colaboration: string[];
}
