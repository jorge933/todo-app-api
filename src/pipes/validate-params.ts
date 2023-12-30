import { ValidationPipe } from '@nestjs/common';

export const PARAMS_VALIDATION_PIPE = new ValidationPipe({
  exceptionFactory: (errors) => {
    const result = errors.map((error) => {
      const [key] = Object.keys(error.constraints);
      return {
        property: error.property,
        message: error.constraints[key],
      };
    });
    return result;
  },
  stopAtFirstError: true,
});
