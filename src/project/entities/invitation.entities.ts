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
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
