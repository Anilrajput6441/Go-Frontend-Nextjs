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
  // Use the same endpoint format as regular delete (known to work)
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
}
