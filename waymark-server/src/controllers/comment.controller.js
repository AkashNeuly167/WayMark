import Comment from "../models/Comment.js";
import Memory from "../models/Memory.js";

export const createComment = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: "Memory not found",
      });
    }

    const comment = await Comment.create({
      memory: memory._id,
      author: req.user._id,
      text: req.body.text,
    });

    memory.commentsCount += 1;

    await memory.save();

    if (memory.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: memory.author,
        sender: req.user._id,
        type: "comment",
        memory: memory._id,
      });
    }

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMemoryComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      memory: req.params.id,
    })
      .populate("author", "username fullName avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Memory.findByIdAndUpdate(comment.memory, {
      $inc: {
        commentsCount: -1,
      },
    });

    await comment.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
