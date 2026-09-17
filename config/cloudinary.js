import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "s8b4ps7b",
  api_key: process.env.CLOUDINARY_API_KEY || "965948911213729",
  api_secret: process.env.CLOUDINARY_API_SECRET || "fhAjHNmTjS-pazIAAaIcCkMLhLg",
  secure: true,
});

export default cloudinary;
