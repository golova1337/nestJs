import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Invitation,
  InvitationDocument,
} from '../entities/invitation.entities';
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

  async findInvitationAndDelete(
    projectId: string,
    invitationToken: string,
  ): Promise<any> {
    const project = await this.invitationModel.findOneAndDelete({
      projectId: projectId,
      token: invitationToken,
    });

    return project;
  }
}
