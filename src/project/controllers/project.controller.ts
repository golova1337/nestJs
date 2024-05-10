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
  HttpStatus,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { Roles } from 'src/utils/common/guard/roles/roles.decorator';
import { Request } from 'express';
import { Response } from '../../helpers/response/Response';
import { responseSuccesfully } from 'src/helpers/types/response-type';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/utils/common/guard/roles/roles.guard';
import { ApiErrorDecorator } from 'src/utils/common/decorators/error/error.decorator';
import { Status } from '../enum/status-enum';

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
  @ApiOperation({
    description:
      'You can create project, however you can not have two projects the same Title.',
  })
  @ApiErrorDecorator(
    HttpStatus.BAD_REQUEST,
    'Bad Request',
    'Bad Request || You can not have  two projects with the same title',
  )
  @ApiErrorDecorator(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Internal Servers Error',
    'Internal Servers Error',
  )
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
  @ApiOperation({ description: 'You can receive all your projects' })
  @ApiQuery({
    name: 'page',
    description: 'what page to show you, default1',
    type: 'string',
  })
  @ApiQuery({
    name: 'perPage',
    description: 'number of projects per page, default is 10',
    type: 'string',
  })
  @ApiQuery({ name: 'status', type: 'string', enum: Status })
  @ApiQuery({
    name: 'sortField',
    type: 'string',
    enum: ['createdAT', 'updatedAt'],
    description: 'defualt createdAT',
  })
  @ApiQuery({
    name: 'sortOrder',
    type: 'string',
    enum: ['asc', 'desc'],
    description: 'defualt asc',
  })
  @ApiErrorDecorator(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Internal Servers Error',
    'Internal Servers Error',
  )
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
  @ApiOperation({
    description: 'You can receive one your project by projectId',
  })
  @ApiParam({ name: 'projectId', type: 'string' })
  @ApiErrorDecorator(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Internal Servers Error',
    'Internal Servers Error',
  )
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
  @ApiOperation({ description: 'You can upadte project by projectId' })
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
