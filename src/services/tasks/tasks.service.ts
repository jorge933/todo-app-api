import { Injectable } from '@nestjs/common';
import { QueryOptions } from 'src/controllers/tasks/tasks.controller';
import { UnitOfWorkService } from '../../modules/unit-of-work/unit-of-work.service';
import { TasksRepository } from '../../repositories/tasks/tasks.repository';
import { CreateTaskDto, EditTaskNameDto } from './task.dto';
@Injectable()
export class TasksService {
  taskRepository: TasksRepository;

  constructor(private readonly unitOfWork: UnitOfWorkService) {
    this.taskRepository = unitOfWork.tasksRepository;
  }

  async getAll(userId: number, queryOptions?: QueryOptions) {
    const params = {
      expression: { owner: userId },
      queryOptions,
      select: ['-owner'],
    };
    const tasks = await this.taskRepository.find(params);

    return tasks;
  }

  async create(userId: number, { name }: CreateTaskDto) {
    const task = await this.taskRepository.create({
      name,
      owner: userId,
    });

    return task;
  }

  async delete(userId: number, id: number) {
    return await this.taskRepository.deleteOne({
      _id: id,
      owner: userId,
    });
  }

  async editTaskName(userId: number, taskInfos: EditTaskNameDto) {
    return await this.taskRepository.updateOne(
      { _id: taskInfos.id, owner: userId },
      { $set: { name: taskInfos.newName } },
    );
  }
}
