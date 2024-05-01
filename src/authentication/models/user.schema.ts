import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { userRoles } from 'src/authentication/enum/user-roles-enum';

export type UserDocument = User & Document;

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

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ enum: userRoles, default: userRoles.User })
  role: userRoles;

  @Prop({ type: { token: String, expiresIn: Date } })
  RefreshToken: { token: string; expiresIn: Date };
}

export const UserSchema = SchemaFactory.createForClass(User);
