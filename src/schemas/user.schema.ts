import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { transformID } from 'src/helpers/id-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'users',
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
export class User {
  id?: number;
  @Prop({ type: Number, unique: true })
  _id?: number;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  photo?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
