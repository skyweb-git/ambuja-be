import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../config/cloudinary.js";
import { connectDB } from "../config/db.js";
import { Media } from "../models/Media.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, "../../my-app/public");

(async () => {
  await connectDB();
  console.log("Uploading Hero Video to Cloudinary...");
  const heroRes = await cloudinary.uploader.upload(path.join(PUBLIC_DIR, "am-web-video-22.mp4"), {
    resource_type: "video",
    folder: "maytri_ambhuja/videos",
    public_id: "hero_video",
    overwrite: true,
  });
  console.log("Hero Video URL:", heroRes.secure_url);

  await Media.findOneAndUpdate(
    { key: "heroVideo" },
    {
      key: "heroVideo",
      title: "Maytri Ambhuja Hero Video",
      category: "video",
      cloudinaryUrl: heroRes.secure_url,
      publicId: heroRes.public_id,
      format: heroRes.format,
      resourceType: "video",
      bytes: heroRes.bytes,
    },
    { upsert: true, new: true }
  );

  console.log("Uploading CTA Video to Cloudinary...");
  const ctaRes = await cloudinary.uploader.upload(path.join(PUBLIC_DIR, "cta-bg.mp4"), {
    resource_type: "video",
    folder: "maytri_ambhuja/videos",
    public_id: "cta_video",
    overwrite: true,
  });
  console.log("CTA Video URL:", ctaRes.secure_url);

  await Media.findOneAndUpdate(
    { key: "ctaVideo" },
    {
      key: "ctaVideo",
      title: "Maytri Ambhuja CTA Video",
      category: "video",
      cloudinaryUrl: ctaRes.secure_url,
      publicId: ctaRes.public_id,
      format: ctaRes.format,
      resourceType: "video",
      bytes: ctaRes.bytes,
    },
    { upsert: true, new: true }
  );

  console.log("✅ All Videos successfully uploaded & registered in MongoDB!");
})();
