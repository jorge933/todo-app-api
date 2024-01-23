import { FilterQuery, SortOrder, UpdateQuery } from 'mongoose';
import { date } from 'src/helpers/date';
import { like } from 'src/helpers/like';
import { Filters, Pagination } from 'src/interfaces/queries';
import { BaseRepository } from 'src/repositories/base/base.repository';

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
    const { sort, page, size } = queryOptions;
    const sortTransformed = this.transformSort(sort);

    delete queryOptions.sort;
    delete queryOptions.page;
    delete queryOptions.size;

    const filters = this.transformFilters(
      queryOptions as { [key: string]: string },
    );

    const pagination: Pagination = {
      page: Number(page) || null,
      size: Number(size) || null,
    };

    const tasks = await this.baseRepository.find({
      expression,
      filters,
      select: ['-owner'],
      sort: sortTransformed ?? {},
      pagination,
    });

    return tasks;
  }

  async findOne(filter: FilterQuery<T>) {
    return await this.baseRepository.findOne(filter);
  }

  transformSort(sort: string) {
    if (!sort) return;
    const [property, order] = sort.split(',');

    return {
      [property]: order as SortOrder,
    };
  }

  transformFilters(filters: { [key: string]: string }) {
    if (!filters) return;

    const filtersTransformed: Filters = {};
    const keys = Object.entries(filters);

    keys.forEach(([key, value]) => {
      const isArray = Array.isArray(value);

      isArray
        ? (filtersTransformed[key] = {
            $gte: this.execOperator(value[0], 'start'),
            $lt: this.execOperator(value[1], 'end'),
          })
        : (filtersTransformed[key] = this.execOperator(value));
    });

    return filtersTransformed;
  }

  execOperator(value: string, option?: string) {
    const [operator] = value.split(':');
    const operatorFunction = this.operators[operator];

    return operatorFunction ? operatorFunction(value, option) : value;
  }

  async delete(filter: FilterQuery<T>) {
    return await this.baseRepository.deleteOne(filter);
  }

  async updateOne(filter: FilterQuery<T>, fieldsToUpdate: UpdateQuery<T>) {
    return await this.baseRepository.updateOne(filter, {
      $set: fieldsToUpdate,
    });
  }
}
