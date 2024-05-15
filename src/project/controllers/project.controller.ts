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
import { CommonResponse } from 'src/helpers/types/response-type';
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
import { Status } from '../enum/status-enum';
import { RemoveDto } from '../dto/remove-project.dto';
import { Project } from '../entities/project.entities';
import { Field, Order } from '../enum/sort-enum';

@ApiBearerAuth()
@ApiTags('projects')
@UseGuards(RolesGuard)
@ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request', 'Bad Request ')
@ApiErrorDecorator(
  HttpStatus.INTERNAL_SERVER_ERROR,
  'Internal Servers Error',
  'Internal Servers Error',
)
@Controller('/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles('user')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Creation',
    description:
      'You can create project, however you can not have two projects the same Title.',
  })
  @ApiCreatedResponse({ type: CommonResponse, status: 201 })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: Request,
  ): Promise<CommonResponse<Project>> {
    const userId = req.user['id'];

    // run service
    const result = await this.projectService.create(createProjectDto, userId);

    //create response
    return Response.succsessfully(result);
  }

  @Get()
  @Roles('user')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Find All projects',
    description: 'You can receive all your projects',
  })
  @ApiQuery({
    name: 'page',
    description: 'what page to show you, default1',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'perPage',
    description: 'number of projects per page, default is 10',
    type: 'string',
    required: false,
  })
  @ApiQuery({ name: 'status', type: 'string', enum: Status, required: false })
  @ApiQuery({
    name: 'sortField',
    type: 'string',
    enum: Field,
    description: 'defualt createdAT',
    required: false,
  })
  @ApiQuery({
    name: 'sortOrder',
    type: 'string',
    enum: Order,
    description: 'defualt asc',
    required: false,
  })
  @ApiCreatedResponse({ type: CommonResponse, status: 200 })
  async findAll(@Req() req: Request): Promise<CommonResponse<Project[]>> {
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
    summary: 'Get One project',
    description: 'You can receive one your project by projectId',
  })
  @ApiParam({ name: 'projectId', type: 'string' })
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found', 'Not Found')
  @ApiCreatedResponse({ type: CommonResponse, status: 200 })
  async findOne(
    @Param('projectId') projectId: string,
    @Req() req: Request,
  ): Promise<CommonResponse<Project>> {
    const userId = req.user['id'];

    // run service
    const result = await this.projectService.findOne({ userId, projectId });

    //create response
    return Response.succsessfully(result);
  }

  @Patch(':projectId')
  @Roles('user')
  @HttpCode(200)
  @ApiParam({ name: 'projectId', type: 'string' })
  @ApiOperation({
    summary: 'Update a project',
    description: 'You can upadte project by projectId',
  })
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found', 'Not Found')
  @ApiCreatedResponse({ type: CommonResponse, status: 200 })
  async update(
    @Req() req: Request,
    @Param('projectId') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<CommonResponse<Project>> {
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
  @ApiOperation({
    summary: 'Deletion',
    description: 'You can remove project or projects  by projectId in body',
  })
  async remove(@Body() body: RemoveDto, @Req() req: Request): Promise<void> {
    const userId = req.user['id'];
    const ids = body.ids;

    // run service
    await this.projectService.remove(userId, ids);

    //create response
    return;
  }
}
