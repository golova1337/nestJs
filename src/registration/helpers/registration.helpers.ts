import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export class RegistrationHelpers {
  static async hashPassword(password: string): Promise<string> {
    const res = await bcrypt.hash(password, 10);

    return res;
  }

  static async comparePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const result: boolean = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!result) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
