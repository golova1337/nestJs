import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { v4 } from 'uuid';
import { AuthRepository } from 'src/authentication/repository/auth.repository';
import { EmojiLogger } from 'src/utils/logger/LoggerService';
import { InvitationRepository } from '../repository/invitation.repository';
import { ProjectRepository } from '../repository/project.repository';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { User } from 'src/authentication/entities/user.entities';
import { Invitation } from '../entities/invitation.entities';
import { Project } from '../entities/project.entities';

@Injectable()
export class SettingsProjectService {
  private readonly logger = new EmojiLogger();
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly invitationRepository: InvitationRepository,
    private readonly projectRepository: ProjectRepository,
    @InjectQueue('send-mail') private sendQueue: Queue,
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

  async access(
    collaborators: string[],
    projectId: string,
  ): Promise<{ data: { collaborators: string[] } }> {
    // chekc collaborators
    const chekColaborators: User[] | [] = await this.authRepository
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
    const createInvitationTokens: {
      projectId: string;
      email: string;
      token: string;
    }[] = await this.createInvitationTokens(collaborators, projectId);

    // save invitation
    await this.invitationRepository
      .create(createInvitationTokens)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Server Error');
      });

    // send invitation
    await this.sendQueue.add(
      'send mails',
      { name: createInvitationTokens },
      {
        delay: 5000,
        priority: 1,
        attempts: 3, //The total number of attempts to try the job until it completes
        backoff: {
          //Backoff setting for automatic retries if the job fails.
          type: 'exponential',
          delay: 60000,
        },
        timeout: 10000, //The number of milliseconds after which the job should fail with a timeout error
        removeOnComplete: true,
      },
    );
    // return
    return {
      data: { collaborators },
    };
  }

  async gainAccess(data: {
    projectId: string;
    token: string;
  }): Promise<{ data: { project: string } }> {
    const { projectId, token } = data;
    // find Invitation And Delete
    const findInvitationAndDelete: Invitation | null =
      await this.invitationRepository
        .findInvitationAndDelete(projectId, token)
        .catch((err) => {
          this.logger.error(err);
          throw new InternalServerErrorException('Internal Server Error');
        });

    if (!findInvitationAndDelete) {
      throw new BadRequestException('Bad Request');
    }
    // push into an array collaboration of project
    const addCollaborate: Project = await this.projectRepository.addCollaborate(
      projectId,
      findInvitationAndDelete.email,
    );

    return {
      data: { project: addCollaborate.title },
    };
  }
}
