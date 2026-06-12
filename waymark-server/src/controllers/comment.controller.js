import Comment from "../models/Comment.js";
import Memory from "../models/Memory.js";
import Notification from "../models/Notification.js";

export const createComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

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
      text: text.trim(),
    });

    await Memory.findByIdAndUpdate(memory._id, {
      $inc: { commentsCount: 1 },
    });

    if (memory.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: memory.author,
        sender: req.user._id,
        type: "comment",
        memory: memory._id,
      });
    }

    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "username fullName avatar"
    );

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Create comment error:", error);

    return res.status(500).json({
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
    console.error("Get comments error:", error);

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

    const memory = await Memory.findById(comment.memory);

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: "Memory not found",
      });
    }

    const isCommentOwner =
      comment.author.toString() === req.user._id.toString();

    const isMemoryOwner =
      memory.author.toString() === req.user._id.toString();

    if (!isCommentOwner && !isMemoryOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this comment",
      });
    }

    await Comment.findByIdAndDelete(comment._id);

    await Memory.updateOne(
      {
        _id: memory._id,
        commentsCount: { $gt: 0 },
      },
      {
        $inc: { commentsCount: -1 },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      deletedCommentId: comment._id,
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete comment",
    });
  }
};