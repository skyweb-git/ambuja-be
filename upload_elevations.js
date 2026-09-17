import cloudinary from "./config/cloudinary.js";
import { connectDB } from "./config/db.js";
import { Media } from "./models/Media.js";

const elevationFiles = [
  {
    key: "elevation_01",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\elevations\\elevation_01.webp",
    category: "elevations",
    title: "Luxury Villa Elevation - Front Facade View 01",
    public_id: "maytri_ambhuja/elevations/elevation_01"
  },
  {
    key: "elevation_02",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\elevations\\elevation_02.webp",
    category: "elevations",
    title: "Luxury Villa Elevation - Corner Angle View 02",
    public_id: "maytri_ambhuja/elevations/elevation_02"
  },
  {
    key: "elevation_03",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\elevations\\elevation_03.webp",
    category: "elevations",
    title: "Luxury Villa Elevation - Grand Modern View 03",
    public_id: "maytri_ambhuja/elevations/elevation_03"
  },
  {
    key: "elevation_04",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\elevations\\elevation_04.webp",
    category: "elevations",
    title: "Luxury Villa Elevation - Street Enclave View 04",
    public_id: "maytri_ambhuja/elevations/elevation_04"
  },
  {
    key: "elevation_05",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\elevations\\elevation_05.webp",
    category: "elevations",
    title: "Luxury Villa Elevation - Contemporary Architecture 05",
    public_id: "maytri_ambhuja/elevations/elevation_05"
  },
  {
    key: "elevation_06",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\elevations\\elevation_06.webp",
    category: "elevations",
    title: "Luxury Villa Elevation - Private Garden Perspective 06",
    public_id: "maytri_ambhuja/elevations/elevation_06"
  },
  {
    key: "elevation_07",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\elevations\\elevation_07.webp",
    category: "elevations",
    title: "Luxury Villa Elevation - Terrace & Balcony View 07",
    public_id: "maytri_ambhuja/elevations/elevation_07"
  },
  {
    key: "elevation_pool",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\elevations\\elevation_pool.webp",
    category: "elevations",
    title: "Clubhouse Resort Swimming Pool & Deck",
    public_id: "maytri_ambhuja/elevations/elevation_pool"
  },
  {
    key: "elevation_cricket_pitch",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\elevations\\elevation_cricket_pitch.webp",
    category: "elevations",
    title: "Professional Cricket Pitch & Outdoor Sports Arena",
    public_id: "maytri_ambhuja/elevations/elevation_cricket_pitch"
  },
  {
    key: "elevation_park_day",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\elevations\\elevation_park_day.webp",
    category: "elevations",
    title: "4.5 Acres Central Park & Landscaped Promenade",
    public_id: "maytri_ambhuja/elevations/elevation_park_day"
  }
];

async function run() {
  await connectDB();
  console.log("Connected to MongoDB Atlas");

  const results = {};

  for (const item of elevationFiles) {
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

  console.log("All 10 Elevation images uploaded & registered successfully!");
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

run().catch(err => {
  console.error("Upload error:", err);
  process.exit(1);
});
