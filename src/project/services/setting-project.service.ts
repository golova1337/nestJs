import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { v4 } from 'uuid';
import { AuthRepository } from 'src/authentication/repository/auth.repository';
import { EmojiLogger } from 'src/utils/logger/LoggerService';
import { AccessProjectDto } from '../dto/access-project.dto';
import { MailService } from './mail.service';
import { InvitationRepository } from '../repository/invitation.repository';
import { ProjectRepository } from '../repository/project.repository';

@Injectable()
export class SettingsProjectService {
  private readonly logger = new EmojiLogger();
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly invitationRepository: InvitationRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly mailService: MailService,
  ) {}

  private async createInvitationTokens(
    colaborators: string[],
    projectId: string,
  ): Promise<{ projectId: string; email: string; token: string }[]> {
    //create token of an invation
    const invitations = await Promise.all(
      colaborators.map(async (colaborator) => {
        // create invitation
        const invationToken = v4();

        // return
        return {
          projectId: projectId,
          email: colaborator,
          token: invationToken,
        };
      }),
    );

    return invitations;
  }

  async access(collaborators: string[], projectId: string): Promise<any> {
    // chekc collaborators
    const chekColaborators = await this.authRepository
      .findByEmail(collaborators)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException();
      });

    if (collaborators.length != chekColaborators.length) {
      this.logger.error('You can not invite unregistered users');
      throw new BadRequestException('Bad Request');
    }

    // create invitation
    const createInvitationTokens = await this.createInvitationTokens(
      collaborators,
      projectId,
    );

    // save invitation
    await this.invitationRepository.create(createInvitationTokens);

    // send invitation
    await this.mailService.sendMail(createInvitationTokens);
    // return
    return {
      message: 'successful invitation',
      collaboration: collaborators,
      meta: {},
    };
  }

  async gainAccess(data: {
    projectId: string;
    invitationToken: string;
  }): Promise<any> {
    const { projectId, invitationToken } = data;
    // find Invitation And Delete
    const findInvitationAndDelete = await this.invitationRepository
      .findInvitationAndDelete(projectId, invitationToken)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Server Error');
      });

    if (!findInvitationAndDelete) {
      throw new BadRequestException('Bad Request');
    }
    // push into an array collaboration of project
    const addCollaborate = await this.projectRepository.addCollaborate(
      projectId,
      findInvitationAndDelete.email,
    );

    return {
      message: 'successful Collaboration ',
      project: addCollaborate.title,
      collaborator:
        addCollaborate.collaboration[addCollaborate.collaboration.length - 1],
      meta: {},
    };
  }
}
