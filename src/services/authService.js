import { api } from "./api";

export const authService = {
  login: (payload) => api.post("/api/auth/login", payload),
  register: (payload) => api.post("/api/auth/register", payload),
  me: (token) => api.get("/api/auth/me", token),
};
