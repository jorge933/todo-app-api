import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../../repositories/tasks/tasks.repository';
import { EditTaskDto } from '../../controllers/tasks/task.dto';
import { Task } from '../../schemas/task.schema';
import { BaseService } from '../base/base.service';

@Injectable()
export class TasksService extends BaseService<Task> {
  constructor(tasksRepository: TasksRepository) {
    super(tasksRepository);
  }

  editTask(
    userId: number,
    taskId: number,
    fieldsToUpdate: Partial<EditTaskDto>,
  ) {
    const entries = Object.entries(fieldsToUpdate);
    entries.forEach(([key, value]) => {
      if (!value) delete fieldsToUpdate[key];
    });

    this.updateOne({ owner: userId, _id: taskId }, fieldsToUpdate);
    return { message: 'Tarefa atualizada com sucesso!' };
  }
}
