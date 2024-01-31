import { Test, TestingModule } from '@nestjs/testing';
import { UNIT_OF_WORK_PROVIDERS } from '../../constants/unit-of-work-providers';
import { TaskPriority } from '../../enums/task-priority';
import { TaskDocument } from '../../schemas/task.schema';
import { TasksService } from '../../services/tasks/tasks.service';
import { CreateTaskDto, DeleteTaskDto, EditTaskDto } from './task.dto';
import { TasksController } from './tasks.controller';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  const userId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService, ...UNIT_OF_WORK_PROVIDERS],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get user tasks', async () => {
    const tasks = [
      {
        id: 1,
        name: 'Read',
        completed: false,
        owner: 1,
        priority: TaskPriority.LOW,
      },
    ];

    jest.spyOn(tasksService, 'find').mockResolvedValue(tasks as TaskDocument[]);

    expect(await controller.getAll(userId)).toBe(tasks);
  });

  it('should create a task with valid priority', async () => {
    const newTask: CreateTaskDto = {
      name: 'Read',
      priority: TaskPriority.MEDIUM,
    };
    const createdTask = { id: 1, ...newTask, completed: false };

    jest
      .spyOn(tasksService, 'create')
      .mockResolvedValue(createdTask as TaskDocument);

    expect(await controller.create(userId, newTask)).toEqual(createdTask);
  });

  it('should delete a task', async () => {
    const taskDeleteDto: DeleteTaskDto = { id: 1 };
    const deleteResult = { acknowledged: true, deletedCount: 1 };

    jest.spyOn(tasksService, 'delete').mockResolvedValue(deleteResult);

    expect(await controller.delete(userId, taskDeleteDto)).toEqual(
      deleteResult,
    );
  });

  it('should call tasksService.editTask and return success message', async () => {
    const userId = 1;
    const taskId = 123;
    const editTaskDto: EditTaskDto = {
      id: taskId,
      name: 'Updated Task Name',
      priority: TaskPriority.HIGH,
    };
    const expectedMessage = {
      message: 'Tarefa atualizada com sucesso!',
    } as any;

    jest.spyOn(tasksService, 'editTask').mockReturnValue(expectedMessage);

    const result = await controller.editTask(userId, editTaskDto);

    expect(tasksService.editTask).toHaveBeenCalledWith(userId, taskId, {
      name: editTaskDto.name,
      priority: editTaskDto.priority,
    });
    expect(result).toEqual(expectedMessage);
  });
});
