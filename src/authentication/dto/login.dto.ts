import {
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { IsEmailExistConstraint } from '../decorators/isEmailExist';

export class LoginDto {
  @IsEmail({}, { message: 'wrong' })
  @IsNotEmpty()
  @Validate(IsEmailExistConstraint)
  email: string;

  @Length(8, 32)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!/\_@#$%^&*()]).{8,}$/)
  password: string;
}
