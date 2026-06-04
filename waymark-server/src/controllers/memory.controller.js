import Memory from "../models/Memory.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import cloudinary from "../config/cloudinary.js";

export const createMemory = async (
  req,
  res
) => {
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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const memories = await Memory.find()
      .populate("author", "username fullName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Memory.countDocuments();

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
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

export const getMemoryById = async (
  req,
  res
) => {
  try {
    const memory = await Memory.findById(
      req.params.id
    ).populate(
      "author",
      "username fullName avatar"
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
      for (const image of memory.images) {
        if (image.publicId) {
          await cloudinary.uploader.destroy(image.publicId);
        }
      }
    }

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

export const toggleLikeMemory = async (
  req,
  res
) => {
  try {
    const memory = await Memory.findById(
      req.params.id
    );

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: "Memory not found",
      });
    }

    const userId = req.user._id;

    const alreadyLiked =
      memory.likes.includes(userId);

    if (alreadyLiked) {
      memory.likes =
        memory.likes.filter(
          (id) =>
            id.toString() !==
            userId.toString()
        );


      return res.status(200).json({
        success: true,
        liked: false,
        likesCount:
          memory.likes.length,
      });
    }

    memory.likes.push(userId);

    await memory.save();

     if(memory.author.toString() !== req.user._id.toString()) {
        await Notification.create({
        recipient: memory.author,
        sender:req.user._id,
        type: "like",
        memory: memory._id,
      });
     }
    

    

      
    return res.status(200).json({
      success: true,
      liked: true,
      likesCount:
        memory.likes.length,
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

    const memory = await Memory.findById(
      req.params.id
    );

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: "Memory not found",
      });
    }

    if (
      memory.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedMemory =
      await Memory.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id);

    const memories = await Memory.find({
      author: {
        $in: user.following,
      },
    })
      .populate("author", "username fullName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Memory.countDocuments({
      author: {
        $in: user.following,
      },
    });

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
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