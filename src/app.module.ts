import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './authentication/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ProjectModule } from './project/project.module';
import { AccessTokenStrategy } from './utils/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './utils/strategies/refreshToken.strategy';
import { RolesGuard } from './utils/common/guard/roles/roles.guard';
import { AccessTokenGuard } from './utils/common/guard/jwt/accessToken.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.URL, {
      minPoolSize: 3,
      maxPoolSize: 10,
    }),
    JwtModule.register({
      global: true,
    }),
    AuthModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    RolesGuard,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AppModule {}
