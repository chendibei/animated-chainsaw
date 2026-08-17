import { useEffect, useMemo, useState } from "react";
import { api, type Task } from "./api";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      setTasks(await api.list());
      setError(null);
    } catch {
      setError("Could not reach the API. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const remaining = useMemo(() => tasks.filter((t) => !t.done).length, [tasks]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const value = title.trim();
    if (!value) return;
    setTitle("");
    await api.add(value);
    await refresh();
  }

  async function handleToggle(id: string) {
    await api.toggle(id);
    await refresh();
  }

  async function handleRemove(id: string) {
    await api.remove(id);
    await refresh();
  }

  return (
    <div className="app">
      <div className="card">
        <header className="header">
          <div className="logo" aria-hidden>🪚</div>
          <div>
            <h1>Animated Chainsaw</h1>
            <p className="subtitle">Cut through your task list.</p>
          </div>
        </header>

        <form className="add-form" onSubmit={handleAdd}>
          <input
            aria-label="New task"
            placeholder="Add a task…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <p className="muted">Loading…</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={task.done ? "task done" : "task"}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => handleToggle(task.id)}
                  />
                  <span>{task.title}</span>
                </label>
                <button
                  className="remove"
                  aria-label={`Remove ${task.title}`}
                  onClick={() => handleRemove(task.id)}
                >
                  ×
                </button>
              </li>
            ))}
            {tasks.length === 0 && <li className="muted empty">All clear. Nice work!</li>}
          </ul>
        )}

        <footer className="footer">
          <span>{remaining} remaining</span>
          <span>{tasks.length} total</span>
        </footer>
      </div>
    </div>
  );
}
