import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({
  collection: 'tasks',
})
export class Task {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
