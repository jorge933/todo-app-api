import { TaskPriority } from 'src/enums/task_priority';

export interface ITask {
  id: number;
  name: string;
  owner: number;
  priority: TaskPriority;
}
