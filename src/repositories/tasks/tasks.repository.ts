import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Task } from '../../schemas/task.schema';

import { BaseRepository } from '../base/base.repository';

@Injectable()
export class TasksRepository extends BaseRepository<Task> {
  constructor(@InjectModel(Task.name) public taskModel: Model<Task>) {
    super(taskModel);
  }
}
