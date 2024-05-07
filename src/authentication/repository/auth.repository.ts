import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../entities/user.entities';
import { Model } from 'mongoose';
import { hash } from 'bcryptjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async save(dto: { email: string; password: string }): Promise<any> {
    const createdUser = new this.userModel(dto);
    return await createdUser.save();
  }

  async findOne(email: string): Promise<any> {
    return this.userModel.findOne({ email: email }).exec();
  }
  async findById(userId: string): Promise<any> {
    return this.userModel.findById({ _id: userId }).exec();
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<any> {
    const hashedRefreshToken = await hash(refreshToken, 10);
    await this.userModel.findByIdAndUpdate(
      { _id: id },
      {
        RefreshToken: {
          token: hashedRefreshToken,
          expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
    );
  }

  async logout(id: string): Promise<any> {
    return await this.userModel.findByIdAndUpdate(
      id,
      {
        $unset: { token: 1, expiresIn: 1 },
      },
      { new: true },
    );
  }

  async findByEmail(emails: string[]): Promise<any> {
    return await this.userModel.find({ email: { $in: emails } });
  }
}
