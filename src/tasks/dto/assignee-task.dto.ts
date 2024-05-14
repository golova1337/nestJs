import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AssigneeDto {
  @ApiProperty({
    name: 'assignee',
    type: String,
    required: true,
    description: 'must be email',
  })
  @IsEmail()
  @IsNotEmpty()
  assignee: string;
}
