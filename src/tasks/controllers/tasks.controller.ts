import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/utils/common/guard/roles/roles.guard';
import { Roles } from 'src/utils/common/guard/roles/roles.decorator';
import { VerifyOwner } from 'src/project/interceptors/verifyOwnerByParam.interceptor';
import { Response } from 'src/helpers/response/Response';
import { CommonResponse } from 'src/helpers/types/response-type';
import { Request } from 'express';
import { ApiErrorDecorator } from 'src/utils/common/decorators/error/error.decorator';
import { AssigneeDto } from '../dto/assignee-task.dto';
import { Task } from 'src/project/entities/project.entities';

@ApiBearerAuth()
@ApiTags('tasks')
@UseGuards(RolesGuard)
@UseInterceptors(VerifyOwner)
@ApiErrorDecorator(
  HttpStatus.INTERNAL_SERVER_ERROR,
  'Internal Servers Error',
  'Internal Servers Error',
)
@ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request', 'Bad Request')
@Controller('/projects/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles('user')
  @HttpCode(201)
  @ApiOperation({ summary: 'Creation', description: 'You can create a task' })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Param('projectId') projectId: string,
  ): Promise<CommonResponse<Task>> {
    //run service
    const result = await this.tasksService.create(createTaskDto, projectId);
    //response
    return Response.succsessfully(result);
  }

  @Get()
  @Roles('user')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get all task',
    description: 'You can get all tour tasks',
  })
  async findAll(
    @Param('projectId') projectId: string,
    @Query() sort: { sortField?: string; sortOrder: string },
    @Req() req: Request,
  ): Promise<CommonResponse<Task[]>> {
    //run service
    const userId = req.user['id'];
    const result = await this.tasksService.findAll({ sort, projectId, userId });
    //response
    return Response.succsessfully(result);
  }

  @Get(':taskId')
  @Roles('user')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get one task',
    description: 'You can get a task by taskId',
  })
  async findOne(
    @Param() param: { projectId: string; taskId: string },
    @Req() req: Request,
  ): Promise<CommonResponse<Task>> {
    //run services
    const userId = req.user['id'];
    const result = await this.tasksService.findOne({ ...param, userId });
    //response
    return Response.succsessfully(result);
  }

  @Patch(':taskId')
  @Roles('user')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update a task',
    description: 'You can update a task by taskId if you are owner',
  })
  async update(
    @Body() updateTaskDto: UpdateTaskDto,
    @Param() params: { taskId: string; projectId: string },
  ): Promise<CommonResponse<Task>> {
    const { taskId, projectId } = params;
    //run services
    const result = await this.tasksService.update(
      taskId,
      projectId,
      updateTaskDto,
    );
    //response
    return Response.succsessfully(result);
  }

  @Delete(':taskId')
  @Roles('user')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Deletion',
    description: 'You can remove a task by taskId',
  })
  async remove(
    @Param() params: { taskId: string; projectId: string },
  ): Promise<void> {
    //run services
    await this.tasksService.remove(params);
    //response
    return;
  }

  @Patch(':taskId/assignee')
  @Roles('user')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Invitation receipt',
    description:
      'The project owner can assign a person to be responsible for a task that is added to the project. The addition is done by email only. This is the endpoint that applies to accept the invitation. You can receive it by mail',
  })
  async assignee(
    @Req() req: Request,
    @Param() params: { taskId: string; projectId: string },
    @Body() body: AssigneeDto,
  ): Promise<CommonResponse<any>> {
    // get data
    const userId = req.user['id'];
    const assignee = body.assignee;

    //run services
    const result = await this.tasksService.assignee({
      userId,
      assignee,
      params,
    });

    //response
    return Response.succsessfully(result);
  }
}
