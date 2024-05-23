import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './authentication/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ProjectModule } from './project/project.module';
import { AccessTokenStrategy } from './utils/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './utils/strategies/refreshToken.strategy';
import { RolesGuard } from './utils/common/guard/roles/roles.guard';
import { AccessTokenGuard } from './utils/common/guard/jwt/accessToken.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { TasksModule } from './tasks/tasks.module';
import { BullModule } from '@nestjs/bull';
import { SeedModule } from './seed/seed.module';
import { EmojiLogger } from './utils/logger/LoggerService';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('LOCALHOST_URL'),
        dbName: configService.get('DATABASE_NAME'),
        // auth: {
        //   username: configService.get('DOCKER_MONGO_ROOT_USERNAME'),
        //   password: configService.get('DOCKER_MONGO_ROOT_PASSWORD'),               //Setup for docker
        // },
        minPoolSize: 3,
        maxPoolSize: 10,
      }),
      inject: [ConfigService],
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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          // password: configService.get('DOCKER_REDIS_PASS'),  //Setup for docker
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ProjectModule,
    TasksModule,
    SeedModule,
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
