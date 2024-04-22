import { IsNotEmpty, IsOptional, Validate } from 'class-validator';
export class CreateProjectDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  userId: string;
}
