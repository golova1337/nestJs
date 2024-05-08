import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { Roles } from 'src/utils/common/guard/roles/roles.decorator';
import { Request } from 'express';
import { Response } from '../../helpers/response/Response';
import { responseSuccesfully } from 'src/helpers/types/response-type';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/utils/common/guard/roles/roles.guard';

@ApiBearerAuth()
@ApiTags('projects')
@UseGuards(RolesGuard)
@Controller('/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles('user')
  @HttpCode(201)
  @ApiBody({ type: CreateProjectDto })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: Request,
  ): Promise<responseSuccesfully> {
    const userId = req.user['id'];

    // run service
    const result = await this.projectService.create(createProjectDto, userId);

    //create response
    return Response.succsessfully(result);
  }

  @Get()
  @Roles('user')
  @HttpCode(200)
  async findAll(@Req() req: Request): Promise<responseSuccesfully> {
    // get condition
    const query = req.query;
    const userId = req.user['id'];

    // run service
    const result = await this.projectService.findAll({ ...query, userId });

    //create response
    return Response.succsessfully(result);
  }

  @Get(':projectId')
  @Roles('user')
  @HttpCode(200)
  async findOne(
    @Param('projectId') projectId: string,
    @Req() req: Request,
  ): Promise<responseSuccesfully> {
    const userId = req.user['id'];

    // run service
    const result = await this.projectService.findOne({ userId, projectId });

    //create response
    return Response.succsessfully(result);
  }

  @Patch(':projectId')
  @Roles('user')
  @HttpCode(200)
  @ApiBody({ type: UpdateProjectDto })
  async update(
    @Req() req: Request,
    @Param('projectId') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<responseSuccesfully> {
    const userId = req.user['id'];
    //run service
    const result = await this.projectService.update(
      userId,
      id,
      updateProjectDto,
    );

    //crete reaponse
    return Response.succsessfully(result);
  }

  @Delete('/delete')
  @Roles('user')
  @HttpCode(204)
  async remove(
    @Body('ids') ids: string[],
    @Req() req: Request,
  ): Promise<responseSuccesfully> {
    const userId = req.user['id'];

    // run service
    const result = await this.projectService.remove(userId, ids);

    //create response
    return Response.succsessfully(result);
  }
}
