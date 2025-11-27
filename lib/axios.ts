import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // allow cookies (for refresh tokens)
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if we're currently refreshing to prevent multiple simultaneous refresh calls
let isRefreshing = false;
interface QueuedRequest {
  resolve: (value?: string) => void;
  reject: (reason?: unknown) => void;
}
let failedQueue: QueuedRequest[] = [];

const processQueue = (
  error: Error | null,
  token: string | undefined = undefined
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor for adding access token
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If 401 → refresh token automatically
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log(
          "[Refresh Token] Access token expired, attempting to refresh..."
        );

        // Try to refresh token
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data.access_token;
        console.log("[Refresh Token] Token refreshed successfully");

        // Store new token
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", newToken);

          // Update AuthContext if available
          if (newToken && refreshResponse.data.user) {
            localStorage.setItem(
              "user",
              JSON.stringify(refreshResponse.data.user)
            );
            // Dispatch custom event to update auth context
            window.dispatchEvent(
              new CustomEvent("tokenRefreshed", {
                detail: { token: newToken, user: refreshResponse.data.user },
              })
            );
          } else if (newToken) {
            // Just notify that token was refreshed
            window.dispatchEvent(
              new CustomEvent("tokenRefreshed", {
                detail: { token: newToken },
              })
            );
          }
        }

        // Process queued requests
        processQueue(null, newToken || undefined);

        // Update original request header and retry
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("[Refresh Token] Failed to refresh token:", refreshError);

        // Refresh failed - logout user
        processQueue(refreshError as Error, undefined);

        if (typeof window !== "undefined") {
          // Clear tokens
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");

          // Dispatch logout event
          window.dispatchEvent(new Event("authStateChanged"));

          // Redirect to login
          if (window.location.pathname !== "/login") {
            console.log("[Refresh Token] Redirecting to login...");
            window.location.href = "/login";
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // If error is not 401 or refresh already failed, reject normally
    return Promise.reject(error);
  }
);

export default api;
