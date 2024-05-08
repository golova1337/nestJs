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
import { MailerModule } from '@nestjs-modules/mailer';
import { TasksModule } from './tasks/tasks.module';
import { BullModule } from '@nestjs/bull';

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
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    BullModule.forRoot({ redis: { host: 'localhost', port: 6379 } }),
    AuthModule,
    ProjectModule,
    TasksModule,
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
