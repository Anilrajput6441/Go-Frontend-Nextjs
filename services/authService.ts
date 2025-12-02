import api from "@/lib/axios";

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  // Return the full response data - context will handle saving token and user data
  return res.data;
}

export async function registerUser(data: unknown) {
  const res = await api.post("/auth/register", data);
  return res.data;
}

export async function refreshToken() {
  const refreshTokenValue = localStorage.getItem("refresh_token");
  const res = await api.post("/auth/refresh", { refresh_token: refreshTokenValue });
  const token = res.data.access_token;

  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }

  return res.data;
}
