import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/utils/common/guard/roles/roles.decorator';
import { AccessProjectDto } from '../dto/access-project.dto';
import { Response } from 'src/helpers/response/Response';
import { responseSuccesfully } from 'src/helpers/types/response-type';
import { SettingsProjectService } from '../services/setting-project.service';
import { VerifyOwner } from '../interceptors/verifyOwnerByParam.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/utils/common/guard/roles/roles.guard';

@ApiBearerAuth()
@ApiTags('projects settingss')
@UseGuards(RolesGuard)
@Controller('/projects/:projectId/settings')
export class ProjectSettingsController {
  constructor(
    private readonly settingsProjectService: SettingsProjectService,
  ) {}
  // create invitation
  @Post('/access')
  @Roles('user')
  @UseInterceptors(VerifyOwner)
  @HttpCode(201)
  async access(
    @Body() body: AccessProjectDto,
    @Param('projectId') projectId: string,
  ): Promise<responseSuccesfully> {
    const collaborators = body.collaboration;
    //run service
    const result = await this.settingsProjectService.access(
      collaborators,
      projectId,
    );
    //return reasponse
    return Response.succsessfully(result);
  }

  //confirm invitation
  @Get('/access')
  @Roles('user')
  @HttpCode(200)
  async gainAccess(
    @Param('projectId') projectId: string,
    @Query('invitationToken') token: string,
  ): Promise<responseSuccesfully> {
    // run service

    const result = await this.settingsProjectService.gainAccess({
      projectId,
      token,
    });

    //return reasponse
    return Response.succsessfully(result);
  }
}
