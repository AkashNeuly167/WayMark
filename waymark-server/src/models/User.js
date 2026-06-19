import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    fullName: {
      type: String,
    },

    avatar: {
      url:{
       type:String,
       default:" "
      },
      publicId: {
        type: String,
        default: " ",
      },
    },

    bio: {
      type: String,
    },

    country: {
      type: String,
      default: " ",
    },

    website: {
      type: String,
      default: " ",
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", UserSchema);
export default User;
