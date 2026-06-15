import api from "../api/axios";

export const getBucketList = async () => {
  const response = await api.get("/bucket-list");
  return response.data;
};

export const createBucketItem = async (itemData) => {
  const response = await api.post("/bucket-list", itemData);
  return response.data;
};

export const updateBucketItem = async (itemId, itemData) => {
  const response = await api.patch(`/bucket-list/${itemId}`, itemData);
  return response.data;
};

export const deleteBucketItem = async (itemId) => {
  const response = await api.delete(`/bucket-list/${itemId}`);
  return response.data;
};