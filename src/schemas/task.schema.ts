import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({
  collection: 'tasks',
  autoIndex: true,
})
export class Task {
  @Prop({ type: Number, unique: true })
  _id?: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, ref: 'User' })
  owner: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
