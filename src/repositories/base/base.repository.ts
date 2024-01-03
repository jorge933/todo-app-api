import {
  Document,
  FilterQuery,
  HydratedDocument,
  Model,
  PopulateOptions,
  QueryOptions,
  SortOrder,
  UpdateQuery,
} from 'mongoose';
import { date } from 'src/helpers/date';
import { like } from 'src/helpers/like';
import { ITask } from 'src/interfaces/task';

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

  async find(
    expression: FilterQuery<T>,
    { filter, sort }: QueryOptions,
    populate?: string | string[],
    select?: string | string[],
  ) {
    let filters = {};

    if (filter) {
      const transformedFilter = this.transformFilter(filter);
      filters = { ...transformedFilter };
    }

    const query = this.model.find({ ...expression, ...filters });

    if (populate) {
      query.populate(populate, select);
    }

    if (sort) {
      const sortTransformed = this.transformSort(sort);
      query.sort(sortTransformed);
    }

    return query;
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

  private transformSort(sort: string) {
    const [property, order] = sort.split(',') as [keyof ITask, SortOrder];

    return {
      [property]: order as SortOrder,
    };
  }

  private transformFilter(filter: string) {
    const filters = filter.split('AND');

    let filterOptions = {};

    filters.forEach((filter) => {
      let [property, start, end] = filter.split(',');

      end
        ? (filterOptions[property] = {
            $gte: date(start),
            $lt: date(end),
          })
        : (filterOptions[property] = like(start));
    });
    return filterOptions;
  }
}
