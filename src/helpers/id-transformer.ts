import { HydratedDocument } from 'mongoose';

export function transformID(
  doc: HydratedDocument<unknown>,
  ret: Record<string, any>,
) {
  const id: number = ret._id;

  delete ret._id;

  return {
    id,
    ...ret,
  };
}
