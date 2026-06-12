import api from "../api/axios";

export const getMemories = async () => {
  const response = await api.get("/memories");
  return response.data;
};

export const getMemoryById = async (id) => {
  const response = await api.get(`/memories/${id}`);
  return response.data;
};

export const toggleLikeMemory = async (id) => {
  const response = await api.patch(`/memories/${id}/like`);
  return response.data;
};

export const getMemoryComments = async (id) => {
  const response = await api.get(`/memories/${id}/comments`);
  return response.data;
};

export const createMemoryComment = async (id, text) => {
  const response = await api.post(`/memories/${id}/comments`, {
    text,
  });

  return response.data;
};

export const deleteMemoryComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};