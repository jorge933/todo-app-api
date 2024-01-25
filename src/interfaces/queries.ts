import { FilterQuery, PopulateOptions, SortOrder } from 'mongoose';

export interface Pagination {
  page: number;
  size: number;
}

export interface FindAllParams<T> {
  expression: FilterQuery<T>;
  filters?: Filters;
  sort?: { [key: string]: SortOrder };
  populate?: PopulateOptions | (string | PopulateOptions)[];
  select?: string | string[];
  pagination?: Pagination;
}

export type Filters = {
  [key: string]: string | Range;
};

type Range = {
  [key in '$gte' | '$lt']: Date;
};
