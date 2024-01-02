import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { ITask } from '../../interfaces/task';
import { Types } from 'mongoose';
import { CreateTaskDto } from './create-task.dto';

describe('TasksService', () => {
  let tasksService: TasksService;

  let tasks: ITask[] = [];
  const owner = 1;
  let idCounter: number;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TasksService,
          useValue: {
            getAll(userId: number) {
              const tasksOfUser = tasks.filter((task) => task.owner === userId);

              return tasksOfUser;
            },

            create(owner: number, { name }: CreateTaskDto) {
              idCounter ? idCounter++ : (idCounter = 1);
              const task = { _id: idCounter, name, owner };
              tasks.push(task);

              return task._id;
            },

            delete(userId: number, id: number) {
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

    tasksService = module.get<TasksService>(TasksService);
  });

  it('should create a task and return id', () => {
    const { length } = tasks;
    const task = {
      name: 'Work',
    };

    tasksService.create(owner, task);

    expect(length + 1).toBe(tasks.length);
  });

  it('should return all tasks from user', () => {
    tasks.push({
      _id: ++idCounter,
      name: 'Read',
      owner: 2,
    });

    const userTasks = tasksService.getAll(owner) as unknown as ITask[];
    const expectedUserTasks = [tasks[0]];

    expect(expectedUserTasks).toEqual(userTasks);
  });

  it('should delete task', () => {
    const { length } = tasks;

    tasksService.delete(owner, tasks[0]._id);

    const expectedLength = length - 1;
    expect(expectedLength).toBe(tasks.length);
  });
});
