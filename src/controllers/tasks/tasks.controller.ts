import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { GetUserId } from '../../modules/auth/decorators/get-user';
import {
  CreateTaskDto,
  EditTaskNameDto,
  DeleteTaskDto,
} from '../../services/tasks/task.dto';
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
  delete(@GetUserId() userId: number, @Body() { id }: DeleteTaskDto) {
    const tasks = this.tasksService.delete(userId, id);
    return tasks;
  }

  @Post('edit')
  editTaskName(
    @GetUserId() userId: number,
    @Body() taskInfos: EditTaskNameDto,
  ) {
    const tasks = this.tasksService.editTaskName(userId, taskInfos);
    return tasks;
  }
}
