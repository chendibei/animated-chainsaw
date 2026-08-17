export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async list(): Promise<Task[]> {
    return json<Task[]>(await fetch("/api/tasks"));
  },
  async add(title: string): Promise<Task> {
    return json<Task>(
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      }),
    );
  },
  async toggle(id: string): Promise<Task> {
    return json<Task>(await fetch(`/api/tasks/${id}`, { method: "PATCH" }));
  },
  async remove(id: string): Promise<void> {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }
  },
};
