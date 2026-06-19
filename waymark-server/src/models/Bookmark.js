import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    memory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Memory",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

bookmarkSchema.index({ user: 1, memory: 1 }, { unique: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;