import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export interface Task {
  _id?: string;
  name: string;
}

class TaskC {
  _id?: MongooseSchema.Types.UUID;
  name: string;
}

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

  @Prop({
    type: { _id: MongooseSchema.Types.UUID, name: String },
    required: true,
  })
  tasks: Task[];
}

export const UserSchema = SchemaFactory.createForClass(User);
