import Bookmark from "../models/Bookmark.js";
import Memory from "../models/Memory.js";

export const saveMemory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { memoryId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User id not found",
      });
    }

    const memory = await Memory.findById(memoryId);

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: "Memory not found",
      });
    }

    const existingBookmark = await Bookmark.findOne({
      user: userId,
      memory: memoryId,
    });

    if (existingBookmark) {
      return res.status(200).json({
        success: true,
        saved: true,
        message: "Memory already saved",
        bookmark: existingBookmark,
      });
    }

    const bookmark = await Bookmark.create({
      user: userId,
      memory: memoryId,
    });

    return res.status(201).json({
      success: true,
      saved: true,
      message: "Memory saved successfully",
      bookmark,
    });
  } catch (error) {
    console.error("Save memory error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const unsaveMemory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { memoryId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User id not found",
      });
    }

    const bookmark = await Bookmark.findOneAndDelete({
      user: userId,
      memory: memoryId,
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        saved: false,
        message: "Bookmark not found",
      });
    }

    return res.status(200).json({
      success: true,
      saved: false,
      message: "Memory removed from saved list",
    });
  } catch (error) {
    console.error("Unsave memory error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSavedMemories = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User id not found",
      });
    }

    const bookmarks = await Bookmark.find({
      user: userId,
    })
      .populate({
        path: "memory",
        populate: {
          path: "author",
          select: "username fullName avatar country",
        },
      })
      .sort({ createdAt: -1 });

    const memories = bookmarks
      .map((bookmark) => bookmark.memory)
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      count: memories.length,
      memories,
    });
  } catch (error) {
    console.error("Get saved memories error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSavedMemoryIds = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User id not found",
      });
    }

    const bookmarks = await Bookmark.find({
      user: userId,
    }).select("memory");

    const savedMemoryIds = bookmarks.map((bookmark) =>
      bookmark.memory.toString(),
    );

    return res.status(200).json({
      success: true,
      savedMemoryIds,
    });
  } catch (error) {
    console.error("Get saved memory ids error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};