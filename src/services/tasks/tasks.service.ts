import { HttpStatus, Injectable } from '@nestjs/common';
import { ListsRepository } from 'src/repositories/lists/lists.repository';
import { CreateTaskDto } from '../../controllers/tasks/task.dto';
import { TasksRepository } from '../../repositories/tasks/tasks.repository';
import { Task } from '../../schemas/task.schema';
import { BaseService } from '../base/base.service';
import { DomainErrorsService } from '../domain-errors/domain-errors.service';
import { HttpTypeErrors } from 'src/enums/http-type-errors';

@Injectable()
export class TasksService extends BaseService<Task> {
  constructor(
    tasksRepository: TasksRepository,
    private readonly listsRepository: ListsRepository,
    private readonly domainErrorsService: DomainErrorsService,
  ) {
    super(tasksRepository);
  }

  async createTask(userId: number, newTask: CreateTaskDto) {
    const list = newTask?.list;

    if (list) {
      const existList = await this.listsRepository.findOne({
        owner: userId,
        _id: list,
      });

      if (!existList) {
        this.domainErrorsService.addError(
          {
            message: 'Você não possui uma lista com o id especificado!',
            type: HttpTypeErrors.NO_EXIST_LIST,
          },
          HttpStatus.FORBIDDEN,
        );
        return;
      }
    }

    return await this.create({ ...newTask, owner: userId, completed: false });
  }
}
