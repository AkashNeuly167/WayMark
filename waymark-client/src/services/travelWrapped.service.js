import api from "../api/axios";

export const getTravelWrapped = async (year) => {
  const response = await api.get(`/travel-wrapped?year=${year}`);
  return response.data;
};