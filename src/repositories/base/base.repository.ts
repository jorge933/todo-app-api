import {
  Document,
  FilterQuery,
  HydratedDocument,
  Model,
  Query,
  QueryOptions,
  SortOrder,
  UpdateQuery,
} from 'mongoose';
import { date } from 'src/helpers/date';
import { like } from 'src/helpers/like';
import { ITask } from 'src/interfaces/task';

export interface Pagination {
  page: number;
  size: number;
}

interface FindAllParams<T> {
  expression: FilterQuery<T>;
  queryOptions?: QueryOptions;
  populate?: string | string[];
  select?: string | string[];
  pagination?: Pagination;
}

export class BaseRepository<T> {
  constructor(public model: Model<T>) {}

  async create(entity: T) {
    const entityCreated = new this.model(entity) as Document<T>;

    await entityCreated.save();

    return (await entityCreated.toJSON()) as HydratedDocument<T>;
  }

  async findOne(expression: FilterQuery<T>) {
    const result = await this.model.findOne(expression);
    return result;
  }

  async find({ expression, queryOptions, populate, select }: FindAllParams<T>) {
    let filters = {};

    const { filter } = queryOptions;

    if (filter) {
      const transformedFilter = this.transformFilter(filter);
      filters = { ...transformedFilter };
    }

    const query = this.model.find({ ...expression, ...filters });

    this.executeQueryMethods(query, { ...queryOptions, populate, select });

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

  private executeQueryMethods(
    query: Query<unknown, unknown, unknown, unknown>,
    { sort, page, size, populate, select }: any,
  ) {
    if (populate) {
      query.populate(populate, select);
    }

    if (select) {
      query.select(select);
    }

    if (sort) {
      const sortTransformed = this.transformSort(sort);
      query.sort(sortTransformed);
    }

    const skip = (page ?? 1) - 1;
    const limit = size ?? 10;

    query.skip(skip * limit).limit(size ?? 10);
  }
}
