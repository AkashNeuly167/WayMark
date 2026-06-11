import api from "../api/axios";

export const getMemories = async () => {
  const response = await api.get("/memories");
  return response.data;
};