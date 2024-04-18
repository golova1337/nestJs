import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.schema';
import { AuthRepository } from './repository/auth.repository';
import { IsEmailUniqueConstraint } from './decorators/isEmailUnique';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { IsEmailExistConstraint } from './decorators/isEmailExist';
import { TokenService } from './services/token.servise';
import { RolesGuard } from 'src/roles/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    AuthRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    RolesGuard,
    IsEmailUniqueConstraint,
    IsEmailExistConstraint,
  ],
})
export class AuthModule {}
