export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

const seedTitles = [
  "Sharpen the chainsaw",
  "Refuel the tank",
  "Clear the fallen branches",
];

export class TaskStore {
  private tasks: Task[] = [];

  constructor(seed = true) {
    if (seed) {
      for (const title of seedTitles) {
        this.add(title);
      }
    }
  }

  list(): Task[] {
    return [...this.tasks].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  add(title: string): Task {
    const trimmed = title.trim();
    if (!trimmed) {
      throw new Error("Task title must not be empty");
    }
    const task: Task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: trimmed,
      done: false,
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(task);
    return task;
  }

  toggle(id: string): Task | undefined {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.done = !task.done;
    }
    return task;
  }

  remove(id: string): boolean {
    const before = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return this.tasks.length < before;
  }
}
