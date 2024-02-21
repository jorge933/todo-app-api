import { TransformFnParams } from 'class-transformer';

export function convertToLowerCase({ value }: TransformFnParams) {
  return typeof value === 'string' ? value.toLowerCase() : value;
}
