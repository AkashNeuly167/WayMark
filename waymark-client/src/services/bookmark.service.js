import api from "../api/axios";

export const getSavedMemories = async () => {
  const response = await api.get("/bookmarks");
  return response.data;
};

export const getSavedMemoryIds = async () => {
  const response = await api.get("/bookmarks/ids");
  return response.data;
};

export const saveMemory = async (memoryId) => {
  const response = await api.post(`/bookmarks/${memoryId}`);
  return response.data;
};

export const unsaveMemory = async (memoryId) => {
  const response = await api.delete(`/bookmarks/${memoryId}`);
  return response.data;
};