import api from "../api/axios";

export const getUserProfile = async (id) => {
  if (id === "me") {
    const response = await api.get("/users/me");
    return response.data;
  }

  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateMyProfile = async (profileData) => {
  const response = await api.patch("/users/me", profileData);
  return response.data;
};

export const updateAvatar = async (avatarData) => {
  const response = await api.patch(`/users/me/avatar`, avatarData);
  return response.data;
};

export const deleteAvatar = async () => {
  const response = await api.delete(`/users/me/avatar`);
  return response.data;
};

export const toggleFollowUser = async (id) => {
  const response = await api.patch(`/users/${id}/follow`);
  return response.data;
};

export const updateCoverImage = async(coverData)=> {
       const response  = await api.patch(`/users/me/cover` , coverData);
       return response.data;
};

export const deleteCoverImage = async () => {
  const response = await api.delete(`/users/me/cover`);
  return response.data;
};

export const getUserFollowers = async(id)=>{
   const response = await api.get(`/users/${id}/followers`);
   return response.data;
};

export const getUserFollowing = async(id)=>{
   const response = await api.get(`/users/${id}/following`);
   return response.data;
};

export const getUserMemories = async (userId) => {
      const {data} = await api.get(`/users/${userId}/memories`);
      return data;
};