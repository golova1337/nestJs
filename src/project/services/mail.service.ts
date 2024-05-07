import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmojiLogger } from 'src/utils/logger/LoggerService';

@Injectable()
export class MailService {
  private readonly logger = new EmojiLogger();
  constructor(
    private readonly mailService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendMail(invitations) {
    await Promise.all(
      invitations.map(async (invitation) => {
        await this.mailService
          .sendMail({
            from: `Providenci Kassulke <${this.configService.get<string>('EMAIL_USERNAME')}>`,
            to: invitation.email,
            subject: 'Invitation',
            text: ` forward to the link   http://localhost:${parseInt(this.configService.get<string>('PORT'), 10) || 3000}/v1/api/projects/${invitation.projectId}/settings/access?invitationToken=${invitation.token}`,
          })
          .catch((err) => {
            this.logger.error(err);
            throw new InternalServerErrorException('Internal Server Error');
          });
      }),
    );
  }
}
