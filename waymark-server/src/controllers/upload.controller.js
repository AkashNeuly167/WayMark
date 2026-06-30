import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const imageUploadOptions = {
  resource_type: "image",
  quality: "auto",
  fetch_format: "auto",
  transformation: [
    {
      width: 1400,
      height: 1400,
      crop: "limit",
    },
  ],
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "waymark",
      ...imageUploadOptions,
    });

    return res.status(200).json({
      success: true,
      image: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    console.error("Single image upload error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "waymark/memories",
            ...imageUploadOptions,
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          },
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    return res.status(200).json({
      success: true,
      count: imageUrls.length,
      images: imageUrls,
    });
  } catch (error) {
    console.error("Multiple image upload error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};