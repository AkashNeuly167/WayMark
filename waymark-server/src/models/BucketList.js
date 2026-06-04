import mongoose from "mongoose";

const bucketListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
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

    notes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "want_to_visit",
        "planning",
        "visited",
      ],
      default: "want_to_visit",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "BucketList",
  bucketListSchema
);