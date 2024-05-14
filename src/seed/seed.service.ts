import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/authentication/entities/user.entities';
import { EmojiLogger } from 'src/utils/logger/LoggerService';
import { faker } from '@faker-js/faker';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new EmojiLogger();
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async onModuleInit() {
    this.logger.log('Seeding data...');
    await this.seedUsers();
    this.logger.log('Data seeding completed');
  }
  generate() {
    return {
      email: faker.internet.email(),
      password: '$2a$10$FSQy2/KxoFKtmoRTjv38CeOYmt2L.9RD3D0xlTWJWRSl.P9henfw2', //password = Example123!}
    };
  }

  // seeding
  async seedUsers(): Promise<void> {
    const users = await faker.helpers.multiple(this.generate, {
      count: 5,
    });

    for (const userData of users) {
      const user = new this.userModel(userData);
      await user.save();
    }
  }
}
