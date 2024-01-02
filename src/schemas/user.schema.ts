import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

interface Task {
  _id?: number;
  name: string;
}
export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'users',
  autoIndex: true,
})
export class User {
  @Prop({ type: Number, unique: true })
  _id?: number;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
