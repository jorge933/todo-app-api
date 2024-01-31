import { FilterQuery, PipelineStage, SortOrder, UpdateQuery } from 'mongoose';
import { date } from '../../helpers/date';
import { like } from '../../helpers/like';
import { Filters, Pagination } from '../../interfaces/queries';
import { BaseRepository } from '../../repositories/base/base.repository';

export class BaseService<T> {
  operators = {
    date,
    like,
  };

  constructor(private readonly baseRepository: BaseRepository<T>) {}

  async create(entity: T) {
    return await this.baseRepository.create(entity);
  }

  async find(
    expression: FilterQuery<T>,
    queryOptions?: { [key: string]: string },
  ) {
    const options = this.getQueryOptions(queryOptions);

    const query = await this.baseRepository.find({
      expression,
      ...options,
    });

    return query;
  }

  async findOne(filter: FilterQuery<T>) {
    return await this.baseRepository.findOne(filter);
  }

  async delete(filter: FilterQuery<T>) {
    return await this.baseRepository.deleteOne(filter);
  }

  async updateOne(filter: FilterQuery<T>, fieldsToUpdate: UpdateQuery<T>) {
    return await this.baseRepository.updateOne(filter, {
      $set: fieldsToUpdate,
    });
  }

  getQueryOptions(queryOptions: { [key: string]: string }) {
    if (!queryOptions) return {};
    let { sort, page = 0, size = 10 } = queryOptions;

    const sortTransformed = this.transformSort(sort);
    const pagination: Pagination = {
      page: Number(page),
      size: Number(size),
    };

    delete queryOptions.sort;
    delete queryOptions.page;
    delete queryOptions.size;

    const filters = this.transformFilters(queryOptions);

    return {
      sort: sortTransformed ?? {},
      filters,
      pagination,
    };
  }

  getAggregateOptions(queryOptions: {
    [key: string]: string;
  }): PipelineStage[] {
    if (!queryOptions) return [];
    const options = [];
    let { page = 0, size = 10, sort } = queryOptions;

    delete queryOptions.page;
    delete queryOptions.size;
    delete queryOptions.sort;

    const filters = this.transformFilters(queryOptions) ?? {};

    const pagination: Pagination = {
      page: Number(page),
      size: Number(size),
    };

    if (sort) {
      const transformedSort = this.transformSort(sort, true) as Record<
        string,
        1 | -1
      >;
      options.push({
        $sort: transformedSort,
      });
    }

    options.push(
      {
        $skip: pagination.page * pagination.size,
      },
      {
        $limit: pagination.size,
      },
      {
        $match: filters,
      },
    );

    return options;
  }

  transformSort(sort: string, isAggregate = false) {
    if (!sort) return;
    let [property, order] = sort.split(',') as [string, SortOrder];

    const transformedSort = {
      [property]: order,
    };

    if (isAggregate) {
      transformedSort[property] = order === 'asc' ? 1 : -1;
    }

    return transformedSort;
  }

  transformFilters(filters: { [key: string]: string | string[] }) {
    if (!filters) return;

    const entries = Object.entries(filters);

    const filtersTransformed: Filters = entries.reduce(
      (previousValue, [key, value]) => {
        const isArray = Array.isArray(value);

        const filterValue = isArray
          ? {
              $gte: this.execOperator(value[0], 'start'),
              $lte: this.execOperator(value[1], 'end'),
            }
          : this.execOperator(value);

        return {
          ...previousValue,
          [key]: filterValue,
        };
      },
      {},
    );

    return filtersTransformed;
  }

  execOperator(value: string, option?: string) {
    const [operator] = value.split(':');
    const operatorFunction = this.operators[operator];

    return operatorFunction ? operatorFunction(value, option) : value;
  }
}
