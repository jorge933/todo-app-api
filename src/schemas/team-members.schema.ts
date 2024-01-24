import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TeamRoles } from 'src/enums/team-roles';

export type TeamMemberDocument = HydratedDocument<TeamMember>;

@Schema({
  collection: 'team-members',
  autoIndex: true,
  versionKey: false,
  timestamps: true,
})
export class TeamMember {
  _id?: Types.ObjectId;

  @Prop({ type: Number, required: true, ref: 'User' })
  memberId: number;

  @Prop({ type: Number, required: true, ref: 'Team' })
  teamId: number;

  @Prop({ type: Number, enum: TeamRoles, required: true })
  role: TeamRoles;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);
