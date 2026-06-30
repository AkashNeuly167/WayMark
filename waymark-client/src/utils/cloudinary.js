export const getOptimizedImageUrl = (url, width = 900) => {
  if (!url || typeof url !== "string") return url;

  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width},c_limit/`,
  );
};