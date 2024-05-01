import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Colaboration } from '../enum/status-colaboration';
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
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  projectId: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  token: string;

  @Prop({ type: Date, default: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
  expiresIn: Date;

  @Prop({ type: String, default: Colaboration.notYetResponded })
  status?: Colaboration;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
