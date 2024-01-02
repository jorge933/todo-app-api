import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { ITask } from 'src/interfaces/task';
import { Types } from 'mongoose';
import { CreateTaskDto } from './create-task.dto';

describe('TasksService', () => {
  let tasksService: TasksService;

  let tasks: ITask[] = [];
  const owner = new Types.ObjectId().toString();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    tasksService = module.get<TasksService>(TasksService);
  });

  it('should create a task and return id', () => {
    const { length } = tasks;
    const task = {
      name: 'Work',
    };

    const taskId = tasksService.create(owner, task);

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
