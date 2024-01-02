import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { TasksRepository } from '../../repositories/tasks/tasks.repository';
import { UnitOfWorkService } from '../../modules/unit-of-work/unit-of-work.service';
import { CreateTaskDto } from './create-task.dto';

@Injectable()
export class TasksService {
  taskRepository: TasksRepository;

  constructor(private unitOfWork: UnitOfWorkService) {
    this.taskRepository = unitOfWork.tasksRepository;
  }

  async getAll(userId: number) {
    const tasks = await this.taskRepository.find({
      owner: userId,
    });

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
      _id: id,
      owner: userId,
    });
  }
}
