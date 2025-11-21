import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // allow cookies (for refresh tokens)
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Interceptor for adding access token
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: If 401 → refresh token automatically
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // try refresh token
        const refresh = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = refresh.data.access_token;
        localStorage.setItem("access_token", newToken);

        // retry original request
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api(error.config);
      } catch (err) {
        console.log("Refresh failed");
      }
    }
    throw error;
  }
);

export default api;
