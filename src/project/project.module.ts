import { Module } from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { ProjectController } from './controllers/project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './entities/project.entities';
import { ProjectRepository } from './repository/project.repository';
import { MailService } from './services/mail.service';
import { SettingsProjectService } from './services/setting-project.service';
import { AuthRepository } from 'src/authentication/repository/auth.repository';
import { User, UserSchema } from 'src/authentication/entities/user.entities';
import { Invitation, InvitationSchema } from './entities/invitation.entities';
import { InvitationRepository } from './repository/invitation.repository';
import { ProjectSettingsController } from './controllers/project-setting.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema },
      { name: Invitation.name, schema: InvitationSchema },
    ]),
  ],
  controllers: [ProjectController, ProjectSettingsController],
  providers: [
    ProjectService,
    ProjectRepository,
    InvitationRepository,
    MailService,
    SettingsProjectService,
    AuthRepository,
  ],
})
export class ProjectModule {}
