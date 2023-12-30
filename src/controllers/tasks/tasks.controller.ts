import { Body, Controller, Delete, Get, Put } from '@nestjs/common';
import { GetUserId } from 'src/modules/auth/decorators/get-user';
import { CreateTaskDto } from 'src/services/tasks/create-task.dto';
import { TasksService } from 'src/services/tasks/tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get()
  getAll(@GetUserId() userId: string) {
    const tasks = this.tasksService.getAll(userId);
    return tasks;
  }

  @Put()
  create(@GetUserId() userId: string, @Body() newTask: CreateTaskDto) {
    const tasks = this.tasksService.create(userId, newTask);
    return tasks;
  }

  @Delete()
  delete(@GetUserId() userId: string, @Body() { id }: { id: string }) {
    const tasks = this.tasksService.delete(userId, id);
    return tasks;
  }
}
