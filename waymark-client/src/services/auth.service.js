import api from "../api/axios";

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const { data } = await api.patch("/auth/change-password", passwordData);
  return data;
};