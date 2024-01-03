import { Injectable } from '@nestjs/common';
import { UnitOfWorkService } from '../../modules/unit-of-work/unit-of-work.service';
import { TasksRepository } from '../../repositories/tasks/tasks.repository';
import { CreateTaskDto, EditTaskNameDto } from './task.dto';
import { ITask } from 'src/interfaces/task';
import { SortOrder } from 'mongoose';

export type Sort = { [key: string]: SortOrder };

@Injectable()
export class TasksService {
  taskRepository: TasksRepository;

  constructor(private unitOfWork: UnitOfWorkService) {
    this.taskRepository = unitOfWork.tasksRepository;
  }

  async getAll(userId: number, sort?: string) {
    let sortTransformed: Sort;

    if (sort) {
      sort = sort.toLowerCase().replace(/sort=/i, '');

      const [property, order] = sort.split(',') as [keyof ITask, SortOrder];

      sortTransformed = {
        [property]: order as SortOrder,
      };
      console.log(sortTransformed);
    }

    const tasks = await this.taskRepository.find(
      {
        owner: userId,
      },
      sortTransformed,
    );

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

  async editTaskName(userId: number, taskInfos: EditTaskNameDto) {
    return await this.taskRepository.updateOne(
      { _id: taskInfos.id, owner: userId },
      { $set: { name: taskInfos.newName } },
    );
  }
}
