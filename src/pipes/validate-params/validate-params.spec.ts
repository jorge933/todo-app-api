import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { PARAMS_VALIDATION_PIPE } from './validate-params';

const validationErrors = [
  {
    target: { name: undefined },
    value: undefined,
    property: 'name',
    children: [],
    constraints: {
      isString: 'name must be a string',
    },
  },
];

describe('AppValidationPipe', () => {
  it('should translate and format validation errors', () => {
    const result = PARAMS_VALIDATION_PIPE['exceptionFactory'](validationErrors);

    expect(result).toEqual([
      { property: 'name', message: 'name deve ser uma string' },
    ]);
  });

  it('should stop at the first validation error', () => {
    const result = PARAMS_VALIDATION_PIPE['exceptionFactory']([
      validationErrors[0],
    ]);

    expect(result).toEqual([
      { property: 'name', message: 'name deve ser uma string' },
    ]);
  });
});
