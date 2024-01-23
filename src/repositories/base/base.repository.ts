import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { FindAllParams } from 'src/interfaces/queries';

export class BaseRepository<T> {
  constructor(public model: Model<T>) {}

  async create(entity: T) {
    const entityCreated = new this.model(entity);

    await entityCreated.save();

    return await entityCreated.toJSON();
  }

  async findOne(expression: FilterQuery<T>) {
    const result = await this.model.findOne(expression);
    return result;
  }

  async find({ expression, filters }: FindAllParams<T>) {
    const query = this.model.find({ ...expression, ...filters });

    return query;
  }

  async updateOne(filter?: FilterQuery<T>, update?: UpdateQuery<T>) {
    return await this.model.updateOne(filter, update).exec();
  }

  async deleteOne(filter?: FilterQuery<T>) {
    return await this.model.deleteOne(filter).exec();
  }
}
