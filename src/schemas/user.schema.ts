import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

export interface Task {
  _id?: ObjectId;
  name: string;
}
export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'users',
})
export class User {
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }] })
  tasks?: Types.DocumentArray<Task>;
}

export const UserSchema = SchemaFactory.createForClass(User);
