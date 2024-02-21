import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { List } from 'src/schemas/list.schema';
import { UnitOfWorkService } from 'src/modules/unit-of-work/unit-of-work.service';

@Injectable()
export class ListsService extends BaseService<List> {
  constructor({ listsRepository }: UnitOfWorkService) {
    super(listsRepository);
  }
}
