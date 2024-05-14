import {
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { IsEmailUniqueConstraint } from '../decorators/isEmailUnique';
import { IsPasswordsMatchingConstraint } from '../decorators/isPasswordsMatching';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrationhDto {
  @IsEmail()
  @IsNotEmpty()
  @Validate(IsEmailUniqueConstraint)
  @ApiProperty({
    type: String,
    example: 'danil@gmail.com',
    required: true,
    name: 'email',
  })
  email: string;

  @Length(8, 32)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!/\_@#$%^&*()]).{8,}$/)
  @ApiProperty({
    type: String,
    description:
      "Should consist of at least 8 characters, include at least 1 uppercase letter, 1 number, and 1 special character: '!/_@#$%^&*()]'.",
    example: 'Example123!',
    required: true,
    name: 'password',
  })
  password: string;

  @Length(8, 32)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!/\_@#$%^&*()]).{8,}$/)
  @ApiProperty({
    type: String,
    description: 'the same like password',
    example: 'Example123!',
    required: true,
    name: 'passwordRepeat',
  })
  @Validate(IsPasswordsMatchingConstraint)
  passwordRepeat: string;
}
