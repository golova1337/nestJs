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
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Roles } from 'src/utils/roles/roles.decorator';
import { RolesGuard } from 'src/utils/roles/roles.guard';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/utils/common/accessToken.guard';
import { Response } from '../helpers/response/Response';
import { responseSuccesfully } from 'src/helpers/types/response-type';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('projects')
@Controller('v1/api/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Roles('user')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post()
  @ApiBody({ type: CreateProjectDto })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: Request,
  ): Promise<responseSuccesfully> {
    const userId = req.user['id'];

    // run service
    const result = await this.projectService.create(
      {
        ...createProjectDto,
      },
      userId,
    );

    //create response
    return Response.succsessfully(result);
  }

  @Roles('user')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get()
  async findAll(@Req() req: Request): Promise<responseSuccesfully> {
    const query = req.query;
    const userId = req.user['id'];
    const condition = { ...query, userId };

    // run service
    const result = await this.projectService.findAll(condition);

    //create response
    return Response.succsessfully(result);
  }

  @Roles('user')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<responseSuccesfully> {
    // run service
    const result = await this.projectService.findOne(id);

    //create response
    return Response.succsessfully(result);
  }

  @Roles('user')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Patch(':id')
  @ApiBody({ type: UpdateProjectDto })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<responseSuccesfully> {
    //run service
    const result = await this.projectService.update(id, updateProjectDto);

    //crete reaponse
    return Response.succsessfully(result);
  }

  @Roles('user')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Delete('/delete')
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
