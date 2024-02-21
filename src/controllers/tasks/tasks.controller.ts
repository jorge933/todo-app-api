import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { TasksService } from '../../services/tasks/tasks.service';
import { GetUserId } from '../../modules/auth/decorators/get-user';
import { CreateTaskDto, DeleteTaskDto, EditTaskDto } from './task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get()
  getAll(
    @GetUserId() userId: number,
    @Query() queryOptions?: { [key: string]: string },
  ) {
    const tasks = this.tasksService.find({ owner: userId }, queryOptions);
    return tasks;
  }

  @Post('create')
  async create(@GetUserId() userId: number, @Body() newTask: CreateTaskDto) {
    const task = await this.tasksService.createTask(userId, newTask);
    return task;
  }

  @Delete()
  delete(@GetUserId() userId: number, @Body() { id }: DeleteTaskDto) {
    const tasks = this.tasksService.delete({ owner: userId, _id: id });
    return tasks;
  }

  @Post('edit')
  async editTask(
    @GetUserId() userId: number,
    @Body() { id, name, priority, completed }: EditTaskDto,
  ) {
    const queryFields = {
      _id: id,
      owner: userId,
    };
    const updateFields = {
      name,
      priority,
      completed,
    };
    return await this.tasksService.updateOne(queryFields, updateFields);
  }
}
