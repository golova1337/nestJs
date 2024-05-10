import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

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
    expires: 7 * 24 * 60 * 60 * 1000,
    default: Date.now() + 7 * 24 * 60 * 60 * 1000,
  })
  expireAt: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
