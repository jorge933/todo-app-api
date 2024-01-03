import { Test, TestingModule } from '@nestjs/testing';
import { ITask } from 'src/interfaces/task';
import { CreateTaskDto, EditTaskNameDto } from '../../services/tasks/task.dto';
import { TasksService } from '../../services/tasks/tasks.service';
import { TasksController } from './tasks.controller';

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  const owner = 1;
  let tasks: ITask[] = [];
  let idCounter: number;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
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

            editTaskName(userId: number, taskInfos: EditTaskNameDto) {
              tasks.forEach((task, index) => {
                const isTaskToEdit =
                  task.owner === userId && task._id === taskInfos.id;

                if (isTaskToEdit) {
                  tasks[index].name = taskInfos.newName;
                }
              });
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

    tasksController.create(owner, task);

    expect(length + 1).toBe(tasks.length);
  });

  it('should return all tasks from user', () => {
    tasks.push({
      _id: ++idCounter,
      name: 'Read',
      owner: 2,
    });

    const userTasks = tasksController.getAll(owner) as unknown as ITask[];
    const expectedUserTasks = [tasks[0]];

    expect(expectedUserTasks).toEqual(userTasks);
  });

  it('should edit task name', () => {
    const editTaskNameDto = { id: 1, newName: 'Listen' };
    tasksController.editTaskName(owner, editTaskNameDto);

    const expectedName = editTaskNameDto.newName;
    const newTaskName = tasks[0].name;
    expect(expectedName).toBe(newTaskName);
  });

  it('should delete task', () => {
    const { length } = tasks;

    tasksController.delete(owner, { id: tasks[0]._id });

    const expectedLength = length - 1;
    expect(expectedLength).toBe(tasks.length);
  });
});
