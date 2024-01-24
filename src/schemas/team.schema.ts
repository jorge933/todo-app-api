import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { transformID } from 'src/helpers/id-transformer';
import { TeamMember } from './team-members.schema';

export type TeamDocument = HydratedDocument<Team>;

@Schema({
  collection: 'teams',
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
export class Team {
  id?: number;
  @Prop({ type: Number, unique: true })
  _id?: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, ref: 'User', required: true })
  owner: number;

  @Prop({ type: Types.Array })
  members?: TeamMember[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
