import api from "@/lib/axios";

export async function getUser() {
  const res = await api.get("/users/");
  return res.data;
}

export async function updateUser(data: unknown) {
  const res = await api.put("/users/", data);
  return res.data;
}

export async function deleteUser() {
  const res = await api.delete("/users/");
  return res.data;
}

export async function changePassword(data: unknown) {
  const res = await api.put("/users/change-password", data);
  return res.data;
}
