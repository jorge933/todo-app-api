import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { List } from '../../schemas/list.schema';

import { BaseRepository } from '../base/base.repository';

@Injectable()
export class ListsRepository extends BaseRepository<List> {
  constructor(@InjectModel(List.name) public listModel: Model<List>) {
    super(listModel);
  }
}
