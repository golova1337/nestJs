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
import { InvitationRepository } from '../repository/invitationRepository';

@Injectable()
export class SettingProject {
  private readonly logger = new EmojiLogger();
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly invitationRepository: InvitationRepository,
    private readonly mailService: MailService,
  ) {}

  private async checkByEmail(colaborators: string[]): Promise<void> {
    // check colaborators
    const chekColaborators = await this.authRepository
      .findByEmail(colaborators)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException();
      });

    if (colaborators.length != chekColaborators.length) {
      this.logger.error('You can not invite unregistered users');
      throw new BadRequestException('Bad Request');
    }
  }

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
    collaborators: AccessProjectDto,
    projectId: string,
  ): Promise<void> {
    // chekc collaborators
    await this.checkByEmail(collaborators.colaboration);

    // create invitation
    const createInvitationTokens = await this.createInvitationTokens(
      collaborators.colaboration,
      projectId,
    );

    // save invitation
    await this.invitationRepository.create(createInvitationTokens);

    // send invitation
    await this.mailService.sendMail(createInvitationTokens, 'Invitation');
  }

  async gainAccess(params: { projectId: string; invitationToken: string }) {
    const { projectId, invitationToken } = params;
    // check token
    const checkToken = await this.invitationRepository
      .checkToken(projectId, invitationToken)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException('Internal Server Error');
      });

    // check expiresIn
    const expiresInDate = checkToken.expiresIn;
    const currentDate = new Date();

    const differenceInMilliseconds =
      expiresInDate.getTime() - currentDate.getTime();

    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    if (!checkToken.length && differenceInDays > 7) {
      throw new BadRequestException('Bad Request');
    }

    const removeToken = await this.invitationRepository.remove(invitationToken);
    return checkToken;
  }
}
