import api from "../api/axios";

export const searchUsers = async (query) => {
  const response = await api.get(
    `/search/users?q=${encodeURIComponent(query)}`
  );

  return response.data;
};

export const searchMemories = async (query) => {
  const response = await api.get(
    `/search/memories?q=${encodeURIComponent(query)}`
  );

  return response.data;
};