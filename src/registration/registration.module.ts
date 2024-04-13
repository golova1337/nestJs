import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { SinUpMiddleware } from './middlewares/singUp.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.schema';
import { RegistrationRepository } from './repository/registration.repository';
import { LoginMiddleware } from './middlewares/login.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService, RegistrationRepository],
})
export class RegistrationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SinUpMiddleware).forRoutes('/singup');
    consumer.apply(LoginMiddleware).forRoutes('/login');
  }
}
