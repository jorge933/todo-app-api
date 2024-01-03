import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, SortOrder } from 'mongoose';

import { Task } from '../../schemas/task.schema';

import { BaseRepository } from '../base/base.repository';
import { Sort } from 'src/services/tasks/tasks.service';

@Injectable()
export class TasksRepository extends BaseRepository<Task> {
  constructor(@InjectModel(Task.name) public taskModel: Model<Task>) {
    super(taskModel);
  }

  async find(expression: FilterQuery<Task>, sort?: Sort) {
    const query = this.model
      .find(expression)
      .populate('owner', ['-__v', '-password'])
      .select(['-__v', '-password']);

    if (sort) query.sort(sort);
    return query;
  }
}
