import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/utils/common/guard/roles/roles.decorator';
import { AccessProjectDto } from '../dto/access-project.dto';
import { Response } from 'src/helpers/response/Response';
import { CommonResponse } from 'src/helpers/types/response-type';
import { SettingsProjectService } from '../services/setting-project.service';
import { VerifyOwner } from '../interceptors/verifyOwnerByParam.interceptor';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/utils/common/guard/roles/roles.guard';
import { ApiErrorDecorator } from 'src/utils/common/decorators/error/error.decorator';

@ApiBearerAuth()
@ApiTags('projects settingss')
@UseGuards(RolesGuard)
@Controller('/projects/:projectId/settings')
@ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request', 'Bad Request')
@ApiErrorDecorator(
  HttpStatus.INTERNAL_SERVER_ERROR,
  'Internal Servers Error',
  'Internal Servers Error',
)
export class ProjectSettingsController {
  constructor(
    private readonly settingsProjectService: SettingsProjectService,
  ) {}
  // create invitation
  @Post('/access')
  @Roles('user')
  @UseInterceptors(VerifyOwner)
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create an invitation',
    description:
      'You can invite collaborators to your project by email, but only registered users. Go to the database, select any existing email and paste it in the "Collaboration" field in the body or create a new user. Do not forget to insert projectd in param.',
  })
  @ApiErrorDecorator(
    HttpStatus.BAD_REQUEST,
    'Bad Request',
    'You can not invite unregistered users',
  )
  @ApiCreatedResponse({ type: CommonResponse })
  async access(
    @Body() body: AccessProjectDto,
    @Param('projectId') projectId: string,
  ): Promise<CommonResponse<{ collaborators: string[] }>> {
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
  @ApiOperation({
    summary: 'Accept the invitation.',
    description:
      'Go back to the Login endpoint and log in as a new user, all seeds have password = Example123!, then go to the email account and use the collaboration invitation. Get the project ID and token to insert into the fields',
  })
  @ApiParam({ name: 'projectId', type: 'string', required: true })
  @ApiQuery({
    name: 'token',
    type: 'string',
    description: 'invitation token, you can receive it by e-mail ',
    required: true,
  })
  @ApiErrorDecorator(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Internal Servers Error',
    'Internal Servers Error',
  )
  @ApiCreatedResponse({ type: CommonResponse })
  async gainAccess(
    @Param('projectId') projectId: string,
    @Query('token') token: string,
  ): Promise<CommonResponse<{ title: string }>> {
    // run service

    const result = await this.settingsProjectService.gainAccess({
      projectId,
      token,
    });

    //return reasponse
    return Response.succsessfully(result);
  }
}
