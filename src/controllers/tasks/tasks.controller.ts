import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { GetUserId } from '../../modules/auth/decorators/get-user';
import { CreateTaskDto } from '../../services/tasks/create-task.dto';
import { TasksService } from '../../services/tasks/tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get()
  getAll(@GetUserId() userId: number) {
    const tasks = this.tasksService.getAll(userId);
    return tasks;
  }

  @Post('create')
  create(@GetUserId() userId: number, @Body() newTask: CreateTaskDto) {
    const tasks = this.tasksService.create(userId, newTask);
    return tasks;
  }

  @Delete()
  delete(@GetUserId() userId: number, @Body() { id }: { id: number }) {
    const tasks = this.tasksService.delete(userId, id);
    return tasks;
  }
}
