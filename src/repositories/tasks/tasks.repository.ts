import { Injectable } from '@nestjs/common';
import { Task } from 'src/schemas/task.schema';
import { BaseRepository } from '../base/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class TasksRepository extends BaseRepository<Task> {
  constructor(@InjectModel(Task.name) public taskModel: Model<Task>) {
    super(taskModel);
  }

  async find(expression: FilterQuery<Task>) {
    const result = await this.model.find(expression);

    return result;
  }
}
