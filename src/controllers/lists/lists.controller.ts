import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ListsService } from 'src/services/lists/lists.service';
import { CreateListDto, DeleteListDto, EditListDto } from './lists.dto';
import { GetUserId } from 'src/modules/auth/decorators/get-user';

@Controller('lists')
export class ListsController {
  constructor(private listsService: ListsService) {}

  @Post('create')
  async create(@GetUserId() userId: number, @Body() { name }: CreateListDto) {
    return await this.listsService.create({
      name,
      owner: userId,
    });
  }

  @Post('edit')
  async editList(
    @GetUserId() userId: number,
    @Body() { name, id }: EditListDto,
  ) {
    return await this.listsService.updateOne(
      { _id: id, owner: userId },
      { name },
    );
  }

  @Delete('')
  async deleteList(@GetUserId() userId: number, @Body() { id }: DeleteListDto) {
    return await this.listsService.delete({ owner: userId, _id: id });
  }
}
