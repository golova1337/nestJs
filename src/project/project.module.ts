import { Module } from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { ProjectController } from './project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './model/project.schema';
import { ProjectRepository } from './repository/projectRepository';
import { MailService } from './services/mail.service';
import { SettingProject } from './services/setting-project.service';
import { AuthRepository } from 'src/authentication/repository/auth.repository';
import { User, UserSchema } from 'src/authentication/models/user.schema';
import { Invitation, InvitationSchema } from './model/invitation.schema';
import { InvitationRepository } from './repository/invitationRepository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema },
      { name: Invitation.name, schema: InvitationSchema },
    ]),
  ],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ProjectRepository,
    InvitationRepository,
    MailService,
    SettingProject,
    AuthRepository,
  ],
})
export class ProjectModule {}
