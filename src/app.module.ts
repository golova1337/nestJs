import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './authentication/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ProjectModule } from './project/project.module';
import { AccessTokenStrategy } from './utils/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './utils/strategies/refreshToken.strategy';
import { RolesGuard } from './utils/roles/roles.guard';

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
    AccessTokenStrategy,
    RefreshTokenStrategy,
    RolesGuard,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
