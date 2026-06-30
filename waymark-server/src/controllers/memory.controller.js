import Memory from "../models/Memory.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import cloudinary from "../config/cloudinary.js";
import validateRequiredFields from "../utils/validateRequiredFields.js";
import Comment from "../models/Comment.js";
import Bookmark from "../models/Bookmark.js";

const getPagination = (req, defaultLimit = 10) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || defaultLimit, 1), 30);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const createMemory = async (req, res) => {
  try {
    const {
      title,
      description,
      country,
      city,
      locationName,
      coordinates,
      images,
    } = req.body;

    const missingFields = validateRequiredFields(req.body, [
      "title",
      "description",
      "country",
      "city",
      "locationName",
    ]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missingFields,
      });
    }

    const memory = await Memory.create({
      title,
      description,
      country,
      city,
      locationName,
      coordinates,
      images,
      author: req.user._id,
    });

    return res.status(201).json({
      success: true,
      memory,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMemories = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req, 10);

    const total = await Memory.countDocuments();

    const memories = await Memory.find()
      .populate("author", "username fullName country avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalMemories: total,
      totalPages,
      hasMore: page < totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      count: memories.length,
      memories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch memories",
      error: error.message,
    });
  }
};

export const getMemoryById = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id).populate(
      "author",
      "username fullName avatar",
    );

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: "Memory not found",
      });
    }

    res.status(200).json({
      success: true,
      memory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: "Memory not found",
      });
    }

    if (memory.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (memory.images && memory.images.length > 0) {
      const deleteImagePromises = memory.images
        .filter((image) => image.publicId)
        .map((image) => cloudinary.uploader.destroy(image.publicId));

      await Promise.all(deleteImagePromises);
    }

    await Comment.deleteMany({
      memory: memory._id,
    });

    await Notification.deleteMany({
      memory: memory._id,
    });

    await Bookmark.deleteMany({
      memory: memory._id,
    });

    await memory.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Memory deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleLikeMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: "Memory not found",
      });
    }

    const userId = req.user._id;

    const alreadyLiked = memory.likes.includes(userId);

    if (alreadyLiked) {
      memory.likes = memory.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );

      await memory.save();

      return res.status(200).json({
        success: true,
        liked: false,
        likesCount: memory.likes.length,
      });
    }

    memory.likes.push(userId);

    await memory.save();

    if (memory.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: memory.author,
        sender: req.user._id,
        type: "like",
        memory: memory._id,
      });
    }

    return res.status(200).json({
      success: true,
      liked: true,
      likesCount: memory.likes.length,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: "Memory not found",
      });
    }

    if (memory.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedMemory = await Memory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      memory: updatedMemory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFeed = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req, 10);

    const user = await User.findById(req.user._id).select("following");

    const filter = {
      author: {
        $in: user.following,
      },
    };

    const total = await Memory.countDocuments(filter);

    const memories = await Memory.find(filter)
      .populate("author", "username fullName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      count: memories.length,
      memories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
