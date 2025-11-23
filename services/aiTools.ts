import api from "@/lib/axios";

export async function aiCreateTask(title: string, description: string) {
  const res = await api.post("/mcp/task/create", { title, description });
  return res.data;
}

export async function aiListTasks() {
  const res = await api.post("/mcp/task/list");
  return res.data;
}

export async function aiUpdateTask(data: unknown) {
  const res = await api.post("/mcp/task/update", data);
  return res.data;
}

export async function aiDeleteTask(id: string) {
  const res = await api.post("/mcp/task/delete", { id });
  return res.data;
}
