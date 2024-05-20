import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { AuthRepository } from '../repository/auth.repository';
import { User } from '../entities/user.entities';

@ValidatorConstraint({ name: 'isEmailExist', async: true })
@Injectable()
export class IsEmailExistConstraint implements ValidatorConstraintInterface {
  constructor(private authRepository: AuthRepository) {}

  async validate(email: string): Promise<boolean> {
    const user: User = await this.authRepository.findOne(email);
    return !!user;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Bad Request';
  }
}
