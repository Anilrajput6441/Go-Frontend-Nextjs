import api from "@/lib/axios";

export async function listTasks() {
  const res = await api.get("/tasks");
  return res.data;
}

export async function createTask(title: string, description: string) {
  const res = await api.post("/tasks", { title, description });
  return res.data;
}

export async function updateTask(id: string, data: unknown) {
  const res = await api.put(`/tasks/${id}`, data);
  return res.data;
}

export async function deleteTask(id: string) {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
}
