import { Injectable } from '@nestjs/common';
import { Task } from '../../schemas/task.schema';
import { UnitOfWorkService } from '../../modules/unit-of-work/unit-of-work.service';
import { BaseService } from '../base/base.service';

@Injectable()
export class TasksService extends BaseService<Task> {
  constructor({ tasksRepository }: UnitOfWorkService) {
    super(tasksRepository);
  }
}
