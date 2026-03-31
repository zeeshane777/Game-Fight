import { api } from "./api";

export const characterService = {
  getActive: (token) => api.get("/api/characters/public", token),
  getAll: (token) => api.get("/api/characters", token),
  create: (payload, token) => api.post("/api/characters", payload, token),
  update: (id, payload, token) => api.put(`/api/characters/${id}`, payload, token),
  toggle: (id, token) => api.patch(`/api/characters/${id}/toggle`, undefined, token),
  remove: (id, token) => api.delete(`/api/characters/${id}`, token),
};
