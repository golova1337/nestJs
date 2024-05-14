import { BadRequestException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from 'src/authentication/enum/user-roles-enum';

export type UserDocument = User & Document;

@Schema()
export class TokenInfo {
  @Prop({ type: String })
  token: string;

  @Prop({ type: Date, default: Date.now() + 7 * 24 * 60 * 60 * 1000 })
  expiresIn: Date;
}

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: true,
  validateBeforeSave: true,
})
export class User {
  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!/_@#$%^&*()]).{8,}$/.test(
          v,
        );
      },
      message: (props) => {
        throw new BadRequestException(`${props.value} is not correct`);
      },
    },
  })
  password: string;

  @Prop({ type: String, enum: Roles, default: Roles.User })
  role: Roles;

  @Prop({ type: TokenInfo })
  refreshToken: TokenInfo;
}

export const UserSchema = SchemaFactory.createForClass(User);
