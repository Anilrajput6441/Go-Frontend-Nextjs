import api from "@/lib/axios";

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  const token = res.data.access_token;

  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }

  return res.data;
}

export async function registerUser(data: unknown) {
  const res = await api.post("/auth/register", data);
  return res.data;
}

export async function refreshToken() {
  const res = await api.post("/auth/refresh", {});
  const token = res.data.access_token;

  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }

  return res.data;
}
