import dotenv from "dotenv";
import path from "path";
import cloudinary from "../config/cloudinary.js";
import { connectDB } from "../config/db.js";
import { Media } from "../models/Media.js";

dotenv.config();

const DESKTOP_DIR = "C:/Users/lenovo/Desktop";

const IMAGES = [
  { key: "gallery001", file: "001.jpeg", publicId: "gallery_001", title: "Grand Clubhouse Architecture", subtitle: "90,000 Sq.Ft of Unmatched Opulence", category: "Architecture" },
  { key: "gallery002", file: "002.jpeg", publicId: "gallery_002", title: "Resort Style Temperature-Controlled Infinity Pool", subtitle: "Olympic Dimension Lap Pool with Jacuzzi", category: "Aquatics" },
  { key: "gallery003", file: "003.jpeg", publicId: "gallery_003", title: "Holistic Wellness Spa & Steam Pavilion", subtitle: "Ayurvedic Treatment & Therapeutic Saunas", category: "Wellness" },
  { key: "gallery004", file: "004.jpeg", publicId: "gallery_004", title: "500-Guest Double-Height Grand Celebration Banquet", subtitle: "Bespoke Lighting for Milestone Events", category: "Banquet" },
  { key: "gallery005", file: "005.jpeg", publicId: "gallery_005", title: "Indoor International Multi-Sport Arena", subtitle: "Hardwood Badminton Courts & Squash", category: "Sports" },
  { key: "gallery006", file: "006.jpeg", publicId: "gallery_006", title: "Boutique Executive Air-Conditioned Guest Suites", subtitle: "Hotel-Grade Hospitality for Relatives & Guests", category: "Suites" },
  { key: "gallery007", file: "007.jpeg", publicId: "gallery_007", title: "Children's Creative Activity Creche & Play Zone", subtitle: "Safe, Monitored Edutainment for Toddlers & Kids", category: "Kids Zone" },
  { key: "gallery008", file: "008.jpeg", publicId: "gallery_008", title: "Private 4K Dolby Atmos Acoustic Preview Theatre", subtitle: "Recliner Seating for Private Movie Screenings", category: "Entertainment" },
  { key: "gallery009", file: "009.jpeg", publicId: "gallery_009", title: "State-of-the-Art Technogym Fitness Center", subtitle: "Cardio, Strength & Dedicated CrossFit Studio", category: "Fitness" },
  { key: "gallery010", file: "010.jpeg", publicId: "gallery_010", title: "Starlit Rooftop Sky Lounge & Alfresco Deck", subtitle: "Panoramic 360° Views of Hyderabad Skyline", category: "Lounge" },
];

(async () => {
  await connectDB();
  console.log("☁️ Uploading Desktop images 001 - 010 to Cloudinary (cloud: s8b4ps7b)...");

  const results = [];

  for (const img of IMAGES) {
    const filePath = path.join(DESKTOP_DIR, img.file);
    console.log(`📤 Uploading ${img.file} from Desktop...`);
    const res = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
      folder: "maytri_ambhuja/gallery",
      public_id: img.publicId,
      overwrite: true,
    });

    console.log(`✅ Uploaded ${img.file} -> ${res.secure_url}`);

    await Media.findOneAndUpdate(
      { key: img.key },
      {
        key: img.key,
        title: img.title,
        category: "image",
        cloudinaryUrl: res.secure_url,
        publicId: res.public_id,
        format: res.format,
        resourceType: "image",
        bytes: res.bytes,
      },
      { upsert: true, new: true }
    );

    results.push({
      id: parseInt(img.key.replace("gallery", "")),
      title: img.title,
      subtitle: img.subtitle,
      category: img.category,
      url: res.secure_url,
    });
  }

  console.log("🎉 All Desktop images uploaded to Cloudinary!");
  console.log("RESULTS_JSON_START");
  console.log(JSON.stringify(results, null, 2));
  console.log("RESULTS_JSON_END");
  process.exit(0);
})();
