import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RegistrationRepository } from '../repository/registration.repository';

@Injectable()
export class SinUpMiddleware implements NestMiddleware {
  constructor(private registrationRepository: RegistrationRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const result = await this.registrationRepository.checkByEmail(
      req.body.email,
    );
    if (result) throw new HttpException('Bad Request', 400);
    next();
  }
}
