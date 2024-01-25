import { Test, TestingModule } from '@nestjs/testing';
import { Document } from 'mongoose';
import { UNIT_OF_WORK_PROVIDERS } from '../../constants/unit-of-work-providers';
import { TaskPriority } from '../../enums/task-priority';
import { Task, TaskDocument } from '../../schemas/task.schema';
import { TasksService } from '../../services/tasks/tasks.service';
import { TasksController } from './tasks.controller';
import { CreateTaskDto, DeleteTaskDto, EditTaskNameDto } from './task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  const userId = 1;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService, ...UNIT_OF_WORK_PROVIDERS],
    }).compile();

    tasksService = app.get<TasksService>(TasksService);
    controller = app.get<TasksController>(TasksController);
  });

  it('should be return user tasks', async () => {
    const tasks = [
      {
        id: 1,
        name: 'Read',
        completed: false,
        owner: 1,
        priority: TaskPriority.LOW,
      },
    ];

    jest
      .spyOn(tasksService, 'find')
      .mockReturnValue(
        Promise.resolve(tasks) as Promise<
          (Document<unknown, {}, Task> & Task & Required<{ _id: number }>)[]
        >,
      );

    expect(tasks).toBe(await controller.getAll(userId));
  });

  it('should be create and task', async () => {
    const newTaskInfos = new CreateTaskDto('read', TaskPriority.LOW);
    const createdTask = {
      id: 1,
      ...newTaskInfos,
      completed: false,
    } as TaskDocument;

    jest
      .spyOn(tasksService, 'create')
      .mockReturnValue(Promise.resolve(createdTask));

    expect(createdTask).toEqual(await controller.create(userId, newTaskInfos));
  });

  it('should be delete task and return result', async () => {
    const taskDeleteDto = new DeleteTaskDto(1);
    const deletedResult = {
      acknowledged: true,
      deletedCount: 1,
    };

    jest
      .spyOn(tasksService, 'delete')
      .mockReturnValue(Promise.resolve(deletedResult));

    expect(deletedResult).toEqual(
      await controller.delete(userId, taskDeleteDto),
    );
  });

  it('should be delete task and return result', async () => {
    const editTaskNameDto = new EditTaskNameDto(1, 'write');
    const editResult = {
      acknowledged: true,
      modifiedCount: 1,
      upsertedId: null,
      upsertedCount: 0,
      matchedCount: 1,
    };

    jest
      .spyOn(tasksService, 'updateOne')
      .mockReturnValue(Promise.resolve(editResult));

    expect(editResult).toEqual(
      await controller.editTaskName(userId, editTaskNameDto),
    );
  });
});
