import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models/user.schema';
import { Model } from 'mongoose';
import { hash } from 'bcryptjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async save(dto): Promise<any> {
    const createdUser = new this.userModel(dto);
    return await createdUser.save();
  }

  async findOne(email: string): Promise<any> {
    return this.userModel.findOne({ email: email }).exec();
  }
  async findById(userId): Promise<any> {
    return this.userModel.findById({ _id: userId }).exec();
  }

  async updateRefreshToken(id, refreshToken) {
    const hashedRefreshToken = await hash(refreshToken, 10);
    const currentDate = new Date();

    const futureDate = new Date(currentDate);
    await this.userModel.findByIdAndUpdate(
      { _id: id },
      {
        token: hashedRefreshToken,
        expiresIn: futureDate.setDate(currentDate.getDate() + 7),
      },
    );
  }

  async logout(userId) {
    await this.userModel.findByIdAndUpdate({ _id: userId }, { token: null });
  }
}
