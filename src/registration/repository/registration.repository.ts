import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../model/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/registrationDto';

@Injectable()
export class RegistrationRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async checkByEmail(email: string): Promise<any> {
    return this.userModel.findOne({ email }).exec();
  }

  async login(id: string, oldTokens: object[], token: string): Promise<any> {
    // update tokens
    return this.userModel.findByIdAndUpdate(
      id,
      { tokens: [...oldTokens, { token, signedAt: Date.now().toString() }] },
      { new: true },
    );
  }

  async logout(email: string) {
    // check user
    const user = await this.userModel.findOne({ email });
    if (!user) throw new HttpException('Bad Request', 400);

    // deleted all tokens
    await this.userModel.updateOne({ email }, { tokens: [] });
  }
}
