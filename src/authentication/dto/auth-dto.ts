import {
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { IsEmailUniqueConstraint } from '../decorators/isEmailUnique';
import { IsPasswordsMatchingConstraint } from '../decorators/isPasswordsMatching';

export class RegistrationhDto {
  @IsEmail({}, { message: 'wrong' })
  @IsNotEmpty()
  @Validate(IsEmailUniqueConstraint)
  email: string;

  @Length(8, 32)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!/\_@#$%^&*()]).{8,}$/)
  password: string;

  @Length(8, 32)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!/\_@#$%^&*()]).{8,}$/)
  @Validate(IsPasswordsMatchingConstraint)
  passwordRepeat: string;
}
