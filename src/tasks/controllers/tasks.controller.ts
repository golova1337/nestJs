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
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/utils/common/guard/roles/roles.guard';
import { Roles } from 'src/utils/common/guard/roles/roles.decorator';
import { VerifyOwner } from 'src/project/interceptors/verifyOwnerByParam.interceptor';
import { Response } from 'src/helpers/response/Response';
import { responseSuccesfully } from 'src/helpers/types/response-type';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('tasks')
@UseGuards(RolesGuard)
@UseInterceptors(VerifyOwner)
@Controller('/v1/api/projects/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles('user')
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Param('projectId') projectId: string,
  ): Promise<responseSuccesfully> {
    //run service
    const result = await this.tasksService.create(createTaskDto, projectId);
    //response
    return Response.succsessfully(result);
  }

  @Get()
  @Roles('user')
  async findAll(
    @Param('projectId') projectId: string,
    @Query() sort: { sortField?: string; sortOrder: string },
    @Req() req: Request,
  ): Promise<responseSuccesfully> {
    //run service
    const userId = req.user['id'];
    const result = await this.tasksService.findAll({ sort, projectId, userId });
    //response
    return Response.succsessfully(result);
  }

  @Get(':taskId')
  @Roles('user')
  async findOne(
    @Param() param: { projectId: string; taskId: string },
    @Req() req: Request,
  ): Promise<responseSuccesfully> {
    //run services
    const userId = req.user['id'];
    const result = await this.tasksService.findOne({ ...param, userId });
    //response
    return Response.succsessfully(result);
  }

  @Patch(':taskId')
  @Roles('user')
  async update(
    @Body() updateTaskDto: UpdateTaskDto,
    @Param() params: { taskId: string; projectId: string },
  ): Promise<responseSuccesfully> {
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
  async remove(
    @Param() params: { taskId: string; projectId: string },
  ): Promise<responseSuccesfully> {
    //run services
    const result = await this.tasksService.remove(params);
    //response
    return Response.succsessfully(result);
  }

  @Patch(':taskId/assignee')
  @Roles('user')
  async assignee(
    @Req() req: Request,
    @Param() params: { taskId: string; projectId: string },
    @Body() body: { assignee: string },
  ): Promise<responseSuccesfully> {
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
