import User from "../models/User.js";
import Memory from "../models/Memory.js";

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const users = await User.find({
      $or: [
        {
          username: {
            $regex: query,
            $options: "i",
          },
        },
        {
          fullName: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    }).select(
      "username fullName bio country profilePicture"
    );

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchMemories = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { country: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { locationName: { $regex: query, $options: "i" } },
      ],
    };

    const total = await Memory.countDocuments(filter);

    const memories = await Memory.find(filter)
      .populate("author", "username fullName avatar profilePicture country")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      q: query,
      page,
      limit,
      total,
      totalPages,
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