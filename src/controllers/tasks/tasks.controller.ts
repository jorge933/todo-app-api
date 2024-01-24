import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { TasksService } from 'src/services/tasks/tasks.service';
import { GetUserId } from '../../modules/auth/decorators/get-user';
import { CreateTaskDto, DeleteTaskDto, EditTaskNameDto } from './task.dto';

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
  create(@GetUserId() userId: number, @Body() newTask: CreateTaskDto) {
    const tasks = this.tasksService.create({
      ...newTask,
      completed: false,
      owner: userId,
    });
    return tasks;
  }

  @Delete()
  delete(@GetUserId() userId: number, @Body() { id }: DeleteTaskDto) {
    const tasks = this.tasksService.delete({ owner: userId, _id: id });
    return tasks;
  }

  @Post('edit')
  editTaskName(
    @GetUserId() userId: number,
    @Body() { id, newName }: EditTaskNameDto,
  ) {
    const tasks = this.tasksService.updateOne(
      { owner: userId, _id: id },
      { name: newName },
    );
    return tasks;
  }
}
