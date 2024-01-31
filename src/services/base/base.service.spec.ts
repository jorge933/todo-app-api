import { date } from '../../helpers/date';
import { BaseService } from './base.service';

describe('BaseService', () => {
  let service: BaseService<any>;

  beforeEach(() => {
    service = new BaseService<any>(null);
  });

  it('should transform sort string into object', () => {
    const sortString = 'name,asc';

    const transformedSort = service.transformSort(sortString);

    expect(transformedSort).toEqual({ name: 'asc' });
  });

  it('should transform filters object', () => {
    const filters = {
      name: 'like:read',
      createdAt: ['date:2024-01-01', 'date:2024-12-31'],
    };

    const transformedFilters = service.transformFilters(filters);

    expect(transformedFilters).toEqual({
      name: 'John',
      createdAt: {
        $gte: date(filters.createdAt[0], 'start'),
        $lt: date(filters.createdAt[1], 'end'),
      },
    });
  });

  it('should execute operator function', () => {
    const value = 'date:2023-01-01';
    const expectedDate = new Date('2023-01-01');

    const result = service.execOperator(value);

    expect(result).toEqual(expectedDate);
  });

  it('should execute operator function with option', () => {
    const value = 'date:2023-01-01';
    const expectedStartDate = new Date('2023-01-01T00:00:00.000Z');
    const expectedEndDate = new Date('2023-01-01T23:59:59.999Z');

    const resultStart = service.execOperator(value, 'start');
    const resultEnd = service.execOperator(value, 'end');

    expect(resultStart).toEqual(expectedStartDate);
    expect(resultEnd).toEqual(expectedEndDate);
  });

  it('should return aggregate options', () => {
    const queryOptions = { page: '1', size: '10' };
    const expectedOptions = [{ $skip: 10 }, { $limit: 10 }];

    const result = service.getAggregateOptions(queryOptions);

    expect(result).toEqual(expectedOptions);
  });
});
