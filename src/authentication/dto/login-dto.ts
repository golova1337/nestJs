import {
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { IsEmailExistConstraint } from '../decorators/isEmailExist';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail({}, { message: 'wrong' })
  @IsNotEmpty()
  @Validate(IsEmailExistConstraint)
  @ApiProperty({ type: String, example: 'danil@gmail.com', required: true })
  email: string;

  @Length(8, 32)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!/\_@#$%^&*()]).{8,}$/)
  @ApiProperty({ type: String, example: 'Example123!', required: true })
  password: string;
}
