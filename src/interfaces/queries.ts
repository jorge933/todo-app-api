import { FilterQuery } from 'mongoose';
import { QueryOptions } from 'src/controllers/tasks/tasks.controller';

export interface Pagination {
  page: number;
  size: number;
}

export interface FindAllParams<T> {
  expression: FilterQuery<T>;
  queryOptions?: QueryOptions;
  populate?: string | string[];
  select?: string | string[];
  pagination?: Pagination;
}
