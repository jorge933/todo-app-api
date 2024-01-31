import { HydratedDocument } from 'mongoose';

export function removeID(
  doc: HydratedDocument<unknown>,
  ret: Record<string, any>,
) {
  delete ret._id;
  delete ret.id;

  return {
    ...ret,
  };
}
