import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProjectRepository } from '../repository/project.repository';

@Injectable()
export class VerifyOwner implements NestInterceptor {
  constructor(private readonly projectRepository: ProjectRepository) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // get req obj
    const req = context.switchToHttp().getRequest();
    // get data
    const userId = req.user['id'];
    const projectId = req.params.projectId;

    // run repo find project by projectId and userId
    const verify = await this.projectRepository.findOne({ userId, projectId });
    if (!verify) {
      throw new BadRequestException('Bad Request');
    }

    return next.handle();
  }
}
