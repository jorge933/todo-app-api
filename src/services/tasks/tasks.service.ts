import { Injectable } from '@nestjs/common';
import { date } from 'src/helpers/date';
import { like } from 'src/helpers/like';
import { Filters, Pagination } from 'src/interfaces/queries';
import { UnitOfWorkService } from '../../modules/unit-of-work/unit-of-work.service';
import { TasksRepository } from '../../repositories/tasks/tasks.repository';
import { CreateTaskDto, EditTaskNameDto } from './task.dto';
import { SortOrder } from 'mongoose';

@Injectable()
export class TasksService {
  taskRepository: TasksRepository;
  operators = {
    date,
    like,
  };

  constructor(private readonly unitOfWork: UnitOfWorkService) {
    this.taskRepository = unitOfWork.tasksRepository;
  }

  async getAll(userId: number, queryOptions?: { [key: string]: string }) {
    const { sort, page, size } = queryOptions;
    const sortTransformed = this.transformSort(sort);

    delete queryOptions.sort;
    delete queryOptions.page;
    delete queryOptions.size;

    const filters = this.transformFilters(
      queryOptions as { [key: string]: string },
    );

    const pagination: Pagination = {
      page: Number(page) || null,
      size: Number(size) || null,
    };

    const tasks = await this.taskRepository.find({
      expression: { owner: userId },
      filters,
      select: ['-owner'],
      sort: sortTransformed ?? {},
      pagination,
    });

    return tasks;
  }

  async create(userId: number, createTask: CreateTaskDto) {
    const task = await this.taskRepository.create({
      ...createTask,
      owner: userId,
      completed: false,
    });

    delete task.owner;

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

  private transformSort(sort: string) {
    const [property, order] = sort.split(',');

    return {
      [property]: order as SortOrder,
    };
  }

  transformFilters(filters: { [key: string]: string }) {
    const filtersTransformed: Filters = {};
    const keys = Object.entries(filters);

    const execOperator = (value: string, options?: unknown) => {
      const [operator] = value.split(':');
      const operatorFunction = this.operators[operator];

      return operatorFunction ? operatorFunction(value, options) : value;
    };

    keys.forEach(([key, value]) => {
      const isArray = Array.isArray(value);

      if (isArray) {
        const filter = {
          $gte: execOperator(value[0], 'start'),
          $lt: execOperator(value[1], 'end'),
        };

        filtersTransformed[key] = filter;
      } else {
        filtersTransformed[key] = execOperator(value);
      }
    });

    return filtersTransformed;
  }
}
