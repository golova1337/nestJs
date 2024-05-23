import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { EmojiLogger } from 'src/utils/logger/LoggerService';

@Processor('send-mail')
export class MailService {
  private readonly logger = new EmojiLogger();
  constructor(
    private readonly mailService: MailerService,
    private configService: ConfigService,
  ) {}

  @Process('send mails')
  async sendMail(job: Job) {
    await Promise.all(
      job.data.name.map(async (invitation) => {
        await this.mailService.sendMail({
          from: `Providenci Kassulke <${this.configService.get<string>('EMAIL_USERNAME')}>`,
          to: invitation.email,
          subject: 'Invitation',
          text: ` forward to the link   http://localhost:${parseInt(this.configService.get<string>('PORT'), 10) || 3000}/v1/projects/${invitation.projectId}/settings/access?token=${invitation.token}`,
        });
      }),
    );
  }
  @OnQueueActive()
  onActive(job: Job) {
    console.log('Local Queue is active');
  }
}
