import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team } from 'src/schemas/team.schema';
import { BaseRepository } from '../base/base.repository';

@Injectable()
export class TeamsRepository extends BaseRepository<Team> {
  constructor(@InjectModel(Team.name) public teamModel: Model<Team>) {
    super(teamModel);
  }
}
