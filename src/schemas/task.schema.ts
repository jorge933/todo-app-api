import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TaskPriority } from '../enums/task-priority';
import { transformID } from '../helpers/id-transformer';

export type TaskDocument = HydratedDocument<Task>;

@Schema({
  collection: 'tasks',
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
export class Task {
  id?: number;
  @Prop({ type: Number, unique: true })
  _id?: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, enum: TaskPriority, required: true })
  priority: TaskPriority;

  @Prop({ type: Boolean, required: true })
  completed: boolean;

  @Prop({ type: Number, ref: 'User', required: true })
  owner: number;

  @Prop({ type: Number, ref: 'List' })
  list?: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
