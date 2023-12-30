import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateTaskDto } from './create-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAll(userId: string) {
    const user = await this.userModel.findOne({ _id: userId });
    return user.tasks;
  }

  async create(userId: string, { name }: CreateTaskDto) {
    const uuid = new Types.UUID();
    await this.userModel.updateOne(
      {
        _id: userId,
      },
      {
        $push: { tasks: { name, _id: uuid } },
      },
    );

    return uuid;
  }

  async delete(userId: string, id: string) {
    return await this.userModel.findOneAndDelete({
      _id: id,
    });
  }
}
