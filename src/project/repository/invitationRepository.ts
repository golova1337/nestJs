import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invitation, InvitationDocument } from '../model/invitation.schema';
import { Model } from 'mongoose';

@Injectable()
export class InvitationRepository {
  constructor(
    @InjectModel(Invitation.name)
    private invitationModel: Model<InvitationDocument>,
  ) {}

  async create(
    data: { projectId: string; email: string; token: string }[],
  ): Promise<void> {
    for (const invitation of data) {
      const create = new this.invitationModel(invitation);
      await create.save();
    }
  }

  async checkToken(projectId: string, invitationToken: string): Promise<any> {
    return this.invitationModel.find({
      projectId: projectId,
      token: invitationToken,
    });
  }

  async remove(invationToken: string): Promise<any> {
    return await this.invitationModel.deleteOne({ token: invationToken });
  }
}
