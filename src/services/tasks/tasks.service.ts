import { Injectable } from '@nestjs/common';
import { QueryOptions } from 'src/controllers/tasks/tasks.controller';
import { UnitOfWorkService } from '../../modules/unit-of-work/unit-of-work.service';
import { TasksRepository } from '../../repositories/tasks/tasks.repository';
import { DomainErrorsService } from '../domain-errors/domain-errors.service';
import { CreateTaskDto, EditTaskNameDto } from './task.dto';
import { Pagination } from 'src/repositories/base/base.repository';
@Injectable()
export class TasksService {
  taskRepository: TasksRepository;

  constructor(
    private readonly unitOfWork: UnitOfWorkService,
    private readonly domainErrorsService: DomainErrorsService,
  ) {
    this.taskRepository = unitOfWork.tasksRepository;
  }

  async getAll(userId: number, queryOptions?: QueryOptions) {
    const params = {
      expression: { owner: userId },
      queryOptions,
      populate: 'owner',
      select: ['-password'],
    };
    const tasks = await this.taskRepository.find(params);

    return tasks;
  }

  async create(userId: number, { name }: CreateTaskDto) {
    const task = await this.taskRepository.create({
      name,
      owner: userId,
    });

    return task._id;
  }

  async delete(userId: number, id: number) {
    return await this.taskRepository.deleteOne({
      id: id,
      owner: userId,
    });
  }

  async editTaskName(userId: number, taskInfos: EditTaskNameDto) {
    return await this.taskRepository.updateOne(
      { id: taskInfos._id, owner: userId },
      { $set: { name: taskInfos.newName } },
    );
  }
}
