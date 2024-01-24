import { TaskPriority } from 'src/enums/task-priority';

export interface ITask {
  id: number;
  name: string;
  owner: number;
  priority: TaskPriority;
  completed: boolean;
}
