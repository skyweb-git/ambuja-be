import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["video", "image", "logo", "document"],
      default: "image",
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: "",
    },
    format: {
      type: String,
      default: "",
    },
    resourceType: {
      type: String,
      default: "image",
    },
    bytes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Media = mongoose.model("Media", mediaSchema);
