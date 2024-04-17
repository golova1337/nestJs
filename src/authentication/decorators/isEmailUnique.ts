import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { AuthRepository } from '../repository/auth.repository';

@ValidatorConstraint({ name: 'isEmailUnique', async: true })
@Injectable()
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private authRepository: AuthRepository) {}

  async validate(email: string): Promise<boolean> {
    return !(await this.authRepository.findOne(email));
  }

  defaultMessage(args: ValidationArguments) {
    return 'Bad Request';
  }
}
