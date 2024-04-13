import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RegistrationRepository } from '../repository/registration.repository';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  constructor(private registrationRepository: RegistrationRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.registrationRepository.checkByEmail(req.body.email);

    if (!user) throw new HttpException('Bad Request', 400);

    req.body.user = user;
    next();
  }
}
