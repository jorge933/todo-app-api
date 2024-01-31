import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamMember } from '../../schemas/team-members.schema';
import { BaseRepository } from '../base/base.repository';

@Injectable()
export class TeamMembersRepository extends BaseRepository<TeamMember> {
  constructor(
    @InjectModel(TeamMember.name) public teamMemberModel: Model<TeamMember>,
  ) {
    super(teamMemberModel);
  }

  async create(entity: TeamMember) {
    const entityCreated = new this.teamMemberModel(entity);

    await entityCreated.save();

    return entityCreated.toJSON();
  }
}
