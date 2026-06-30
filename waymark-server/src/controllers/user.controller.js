import User from "../models/User.js";
import Notification from "../models/Notification.js";
import cloudinary from "../config/cloudinary.js";
import Memory from "../models/Memory.js";


export const getMyProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, country, website } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName,
        bio,
        country,
        website,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserMemories = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("_id");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const memories = await Memory.find({ author: req.params.id })
      .populate("author", "username fullName avatar country")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: memories.length,
      memories,
    });
  } catch (error) {
    console.error("Get user memories error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const { url, publicId } = req.body;

    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User id not found",
      });
    }

    if (!url || !publicId) {
      return res.status(400).json({
        success: false,
        message: "Avatar url and publicId are required",
      });
    }

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (currentUser.avatar?.publicId) {
      await cloudinary.uploader.destroy(currentUser.avatar.publicId);
    }

    currentUser.avatar = {
      url,
      publicId,
    };

    await currentUser.save();

    const updatedUser = await User.findById(userId).select("-password");

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update avatar error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAvatar = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User id not found",
      });
    }

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (currentUser.avatar?.publicId) {
      await cloudinary.uploader.destroy(currentUser.avatar.publicId);
    }

    currentUser.avatar = {
      url: "",
      publicId: "",
    };

    await currentUser.save();

    const updatedUser = await User.findById(userId).select("-password");

    return res.status(200).json({
      success: true,
      message: "Avatar deleted successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Delete avatar error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleFollowUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (currentUser._id.toString() === targetUser._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot follow yourself",
      });
    }

    const alreadyFollowing = currentUser.following.some(
      (id) => id.toString() === targetUser._id.toString(),
    );

    if (alreadyFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUser._id.toString(),
      );

      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUser._id.toString(),
      );

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        success: true,
        following: false,
        message: "User unfollowed successfully",
      });
    }

    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);

    await currentUser.save();
    await targetUser.save();

    await Notification.create({
      recipient: targetUser._id,
      sender: currentUser._id,
      type: "follow",
    });

    return res.status(200).json({
      success: true,
      following: true,
      message: "User followed successfully",
    });
  } catch (error) {
    console.error("Follow error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCoverImage = async (req, res) => {
  try {
    const { url, publicId } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User id not found",
      });
    }

    if (!url || !publicId) {
      return res.status(400).json({
        success: false,
        message: "Cover image url and publicId are required",
      });
    }

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (currentUser.coverImage?.publicId) {
      await cloudinary.uploader.destroy(currentUser.coverImage.publicId);
    }

    currentUser.coverImage = { url, publicId };
    await currentUser.save();

    const updatedUser = await User.findById(userId).select("-password");

    return res.status(200).json({
      success: true,
      message: "Cover image updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update cover image error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCoverImage = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User id not found",
      });
    }

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (currentUser.coverImage?.publicId) {
      await cloudinary.uploader.destroy(currentUser.coverImage.publicId);
    }

    currentUser.coverImage = { url: "", publicId: "" };
    await currentUser.save();

    const updatedUser = await User.findById(userId).select("-password");

    return res.status(200).json({
      success: true,
      message: "Cover image removed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Delete cover image error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers",
      "username fullName avatar country bio",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      count: user.followers.length,
      followers: user.followers,
    });
  } catch (error) {
    console.error("Get followers error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getUserFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "following",
      "username fullName avatar country bio",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      count: user.following.length,
      following: user.following,
    });
  } catch (error) {
    console.error("Get following error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};