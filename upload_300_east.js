import cloudinary from "./config/cloudinary.js";
import { connectDB } from "./config/db.js";
import { Media } from "./models/Media.js";

const east300FloorplanFiles = [
  {
    key: "floorplan_300_east_ground",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\floorplans\\300east_ground.jpg",
    category: "floorplans",
    title: "300 SQ YDS East Facing - Ground Floor Plan",
    public_id: "maytri_ambhuja/floorplans/300_east_ground"
  },
  {
    key: "floorplan_300_east_first",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\floorplans\\300east_first.jpg",
    category: "floorplans",
    title: "300 SQ YDS East Facing - First Floor Plan",
    public_id: "maytri_ambhuja/floorplans/300_east_first"
  },
  {
    key: "floorplan_300_east_terrace",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\floorplans\\300east_terrace.jpg",
    category: "floorplans",
    title: "300 SQ YDS East Facing - Terrace Floor Plan",
    public_id: "maytri_ambhuja/floorplans/300_east_terrace"
  }
];

async function run() {
  await connectDB();
  console.log("Connected to MongoDB Atlas");

  const results = {};

  for (const item of east300FloorplanFiles) {
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

  console.log("All 300 East floor plans uploaded & registered successfully!");
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

run().catch(err => {
  console.error("Upload error:", err);
  process.exit(1);
});
