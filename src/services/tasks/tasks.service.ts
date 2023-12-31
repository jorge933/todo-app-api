import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from 'src/schemas/task.schema';
import { CreateTaskDto } from './create-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async getAll(userId: string) {
    const user = await this.taskModel.find({
      owner: new Types.ObjectId(userId),
    });

    return user;
  }

  async create(userId: string, { name }: CreateTaskDto) {
    const task = new this.taskModel({
      name,
      owner: new Types.ObjectId(userId),
    });

    task.save();

    return task._id;
  }

  async delete(userId: string, id: string) {
    await this.taskModel
      .updateOne(
        {
          _id: new Types.ObjectId(userId),
        },
        {
          $pull: { tasks: { _id: new Types.UUID(id) } },
        },
      )
      .exec();
  }
}
