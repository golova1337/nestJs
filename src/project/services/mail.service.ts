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

  async sendMail(data, subject: string) {
    await Promise.all(
      data.map(async (collaborate) => {
        await this.mailService
          .sendMail({
            from: `Providenci Kassulke <${this.configService.get<string>('EMAIL_USERNAME')}>`,
            to: collaborate.email,
            subject: subject,
            text: ` forward to the link   http://localhost:3000/v1/api/projects/${collaborate.projectId}/access/${collaborate.token}`,
          })
          .catch((err) => {
            this.logger.error(err);
            throw new InternalServerErrorException('Internal Server Error');
          });
      }),
    );
  }
}
