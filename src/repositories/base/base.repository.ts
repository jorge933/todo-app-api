import {
  Document,
  FilterQuery,
  HydratedDocument,
  Model,
  PopulateOptions,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

export class BaseRepository<T> {
  entityToPopulate: PopulateOptions;
  constructor(
    public model: Model<T>,
    entityToPopulate?: PopulateOptions,
  ) {
    this.entityToPopulate = entityToPopulate;
  }

  async create(entity: T) {
    const entityCreated = new this.model(entity) as Document<T>;

    await entityCreated.save();

    return (await entityCreated.toJSON()) as HydratedDocument<T>;
  }

  async findOne(expression: FilterQuery<T>) {
    const result = await this.model.findOne(expression);
    return result;
  }

  async find(expression: FilterQuery<T>) {
    const result = await this.model.find(expression);
    return result;
  }

  async updateOne(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T>,
    options?: QueryOptions,
  ) {
    return await this.model.updateOne(filter, update, options).exec();
  }

  async deleteOne(filter?: FilterQuery<T>) {
    return await this.model.deleteOne(filter).exec();
  }
}
