import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Time } from 'src/authentication/enum/time-enum';

export type InvitationDocument = Invitation & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  validateBeforeSave: true,
  timestamps: true,
})
export class Invitation {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  projectId: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  token: string;
  @Prop({
    type: Date,
    expires: Time.seven,
    default: Date.now() + Time.seven,
  })
  expireAt: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
