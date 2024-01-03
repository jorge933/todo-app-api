import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, SortOrder } from 'mongoose';

import { Task } from '../../schemas/task.schema';

import { BaseRepository } from '../base/base.repository';
import { QueryOptions } from 'src/controllers/tasks/tasks.controller';
import { ITask } from 'src/interfaces/task';
import { date } from 'src/helpers/date';
import { like } from 'src/helpers/like';

@Injectable()
export class TasksRepository extends BaseRepository<Task> {
  constructor(@InjectModel(Task.name) public taskModel: Model<Task>) {
    super(taskModel);
  }
}
