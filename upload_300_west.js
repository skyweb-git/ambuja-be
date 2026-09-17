import cloudinary from "./config/cloudinary.js";
import { connectDB } from "./config/db.js";
import { Media } from "./models/Media.js";

const clubhouseFiles = [
  {
    key: "clubhouse_front_panorama",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\clubhouse\\clubhouse_front_panorama.webp",
    category: "clubhouse",
    title: "90,000 SFT Club House - Grand Facade & Swimming Pool",
    public_id: "maytri_ambhuja/clubhouse/clubhouse_front_panorama"
  },
  {
    key: "clubhouse_pool_aerial",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\clubhouse\\clubhouse_pool_aerial.webp",
    category: "clubhouse",
    title: "Club House - Grand Swimming Pool & Sun Deck View",
    public_id: "maytri_ambhuja/clubhouse/clubhouse_pool_aerial"
  },
  {
    key: "clubhouse_evening_elevation",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\clubhouse\\clubhouse_evening_elevation.webp",
    category: "clubhouse",
    title: "Club House - Evening Illumination & Poolside",
    public_id: "maytri_ambhuja/clubhouse/clubhouse_evening_elevation"
  },
  {
    key: "clubhouse_courtyard_lawn",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\clubhouse\\clubhouse_courtyard_lawn.webp",
    category: "clubhouse",
    title: "Club House - Landscaped Courtyard & Central Lawn",
    public_id: "maytri_ambhuja/clubhouse/clubhouse_courtyard_lawn"
  }
];

async function run() {
  await connectDB();
  console.log("Connected to MongoDB Atlas");

  const results = {};

  for (const item of clubhouseFiles) {
    console.log(`Uploading ${item.title}...`);
    const uploadRes = await cloudinary.uploader.upload(item.path, {
      public_id: item.public_id,
      overwrite: true,
      resource_type: "image"
    });

    console.log(`Uploaded to Cloudinary: ${uploadRes.secure_url}`);
    results[item.key] = uploadRes.secure_url;

    await Media.findOneAndUpdate(
      { key: item.key },
      {
        key: item.key,
        title: item.title,
        category: item.category,
        url: uploadRes.secure_url,
        publicId: uploadRes.public_id,
        format: uploadRes.format,
        resourceType: "image"
      },
      { upsert: true, new: true }
    );
  }

  console.log("All Clubhouse images uploaded & registered successfully!");
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

run().catch(err => {
  console.error("Upload error:", err);
  process.exit(1);
});

