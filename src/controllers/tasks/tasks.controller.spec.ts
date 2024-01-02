import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { ITask } from 'src/interfaces/task';
import { CreateTaskDto } from '../../services/tasks/create-task.dto';
import { TasksService } from '../../services/tasks/tasks.service';
import { TasksController } from './tasks.controller';

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  let tasks: ITask[] = [];
  const owner = new Types.ObjectId().toString();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            getAll(userId: string) {
              const tasksOfUser = tasks.filter((task) => task.owner === userId);

              return tasksOfUser;
            },

            create(owner: string, { name }: CreateTaskDto) {
              const id = new Types.ObjectId().toString();
              const task = { _id: id, name, owner };
              tasks.push(task);

              return id;
            },

            delete(userId: string, id: string) {
              const newTasksValue = tasks.filter((task) => {
                const isTaskToRemove =
                  (task.owner === userId && task._id !== id) ||
                  task.owner !== userId;
                return isTaskToRemove;
              });

              tasks = newTasksValue;
            },
          },
        },
      ],
    }).compile();
    tasksService = app.get<TasksService>(TasksService);
    tasksController = app.get<TasksController>(TasksController);
  });

  it('should create a task and return id', () => {
    const { length } = tasks;
    const task = {
      name: 'Work',
    };

    const taskId = tasksController.create(owner, task);

    expect(length + 1).toBe(tasks.length);
  });

  it('should return all tasks from user', () => {
    const id = new Types.ObjectId().toString();
    const userId = new Types.ObjectId().toString();
    tasks.push({
      _id: id,
      name: 'Read',
      owner: userId,
    });

    const userTasks = tasksController.getAll(owner) as unknown as ITask[];
    const expectedUserTasks = [tasks[0]];

    expect(expectedUserTasks).toEqual(userTasks);
  });

  it('should delete task', () => {
    const { length } = tasks;

    tasksController.delete(owner, { id: tasks[0]._id });

    const expectedLength = length - 1;
    expect(expectedLength).toBe(tasks.length);
  });
});
