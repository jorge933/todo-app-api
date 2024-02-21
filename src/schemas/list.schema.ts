import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { transformID } from '../helpers/id-transformer';

export type ListDocument = HydratedDocument<List>;

@Schema({
  collection: 'lists',
  autoIndex: true,
  versionKey: false,
  timestamps: true,
  toObject: {
    transform: transformID,
  },
  toJSON: {
    transform: transformID,
  },
})
export class List {
  id?: number;
  @Prop({ type: Number, unique: true })
  _id?: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, ref: 'User', required: true })
  owner: number;
}

export const ListSchema = SchemaFactory.createForClass(List);
