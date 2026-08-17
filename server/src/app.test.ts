import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";
import { TaskStore } from "./store.js";

describe("tasks API", () => {
  it("reports health", async () => {
    const app = createApp(new TaskStore(false));
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("creates, toggles, and deletes a task", async () => {
    const app = createApp(new TaskStore(false));

    const created = await request(app).post("/api/tasks").send({ title: "Fell the oak" });
    expect(created.status).toBe(201);
    expect(created.body.title).toBe("Fell the oak");
    expect(created.body.done).toBe(false);

    const id = created.body.id as string;

    const toggled = await request(app).patch(`/api/tasks/${id}`);
    expect(toggled.status).toBe(200);
    expect(toggled.body.done).toBe(true);

    const list = await request(app).get("/api/tasks");
    expect(list.body).toHaveLength(1);

    const removed = await request(app).delete(`/api/tasks/${id}`);
    expect(removed.status).toBe(204);

    const empty = await request(app).get("/api/tasks");
    expect(empty.body).toHaveLength(0);
  });

  it("rejects empty titles", async () => {
    const app = createApp(new TaskStore(false));
    const res = await request(app).post("/api/tasks").send({ title: "   " });
    expect(res.status).toBe(400);
  });
});
