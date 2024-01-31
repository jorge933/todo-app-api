import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from '../../repositories/tasks/tasks.repository';
import { EditTaskDto } from '../../controllers/tasks/task.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Task } from '../../schemas/task.schema';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        TasksRepository,
        { provide: getModelToken(Task.name), useValue: jest.fn() },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should edit a task successfully', () => {
    const userId = 1;
    const taskId = 123;
    const editTaskDto: Partial<EditTaskDto> = {
      name: 'Updated Task Name',
    };
    const expectedMessage = { message: 'Tarefa atualizada com sucesso!' };

    jest.spyOn(service, 'updateOne').mockImplementation(jest.fn());

    const result = service.editTask(userId, taskId, editTaskDto);

    expect(service.updateOne).toHaveBeenCalledWith(
      { owner: userId, _id: taskId },
      editTaskDto,
    );
    expect(result).toEqual(expectedMessage);
  });
});
