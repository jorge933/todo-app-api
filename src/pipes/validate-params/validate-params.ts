import { ValidationPipe } from '@nestjs/common';
import { MESSAGES_TRANSLATED } from './messages-translated';

export const PARAMS_VALIDATION_PIPE = new ValidationPipe({
  exceptionFactory: (errors) => {
    const result = errors.map((error) => {
      const [key] = Object.keys(error.constraints);

      MESSAGES_TRANSLATED.forEach(({ message, translation }) => {
        error.constraints[key] = error.constraints[key].replace(
          message,
          translation,
        );
      });

      return {
        property: error.property,
        message: error.constraints[key],
      };
    });
    return result;
  },
  stopAtFirstError: true,
});
