import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    locationName: {
      type: String,
      required: true,
    },

    coordinates: {
      lat: Number,
      lng: Number,
    },

    images: [
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

memorySchema.index({ author: 1, createdAt: -1 });
memorySchema.index({ createdAt: -1 });
memorySchema.index({ country: 1 });
memorySchema.index({ city: 1 });
memorySchema.index({
  title: "text",
  description: "text",
  country: "text",
  city: "text",
  locationName: "text",
});

const Memory = mongoose.model("Memory", memorySchema);

export default Memory;
