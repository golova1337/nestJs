import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entities';
import { AuthRepository } from './repository/auth.repository';
import { IsEmailUniqueConstraint } from './decorators/isEmailUnique';
import { IsEmailExistConstraint } from './decorators/isEmailExist';
import { TokenService } from './services/token.servise';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    AuthRepository,
    IsEmailUniqueConstraint,
    IsEmailExistConstraint,
  ],
})
export class AuthModule {}
