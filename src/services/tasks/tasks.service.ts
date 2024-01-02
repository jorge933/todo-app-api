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

  async getAll(userId: string) {
    const tasks = await this.taskRepository.find({
      owner: new Types.ObjectId(userId),
    });

    return tasks;
  }

  async create(userId: string, { name }: CreateTaskDto) {
    const task = await this.taskRepository.create({
      name,
      owner: new Types.ObjectId(userId),
    });

    return task._id;
  }

  async delete(userId: string, id: string) {
    return await this.taskRepository.deleteOne({
      _id: new Types.ObjectId(id),
      owner: new Types.ObjectId(userId),
    });
  }
}
