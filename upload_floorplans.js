import cloudinary from "./config/cloudinary.js";
import { connectDB } from "./config/db.js";
import { Media } from "./models/Media.js";

const floorplanFiles = [
  {
    key: "floorplan_222_east_ground",
    path: "C:\\Users\\lenovo\\Desktop\\222eastGroundFloor 001.webp",
    category: "floorplans",
    title: "222 SQ YDS East Facing - Ground Floor Plan",
    public_id: "maytri_ambhuja/floorplans/222_east_ground"
  },
  {
    key: "floorplan_222_east_first",
    path: "C:\\Users\\lenovo\\Desktop\\222eastFirstfloor 002.webp",
    category: "floorplans",
    title: "222 SQ YDS East Facing - First Floor Plan",
    public_id: "maytri_ambhuja/floorplans/222_east_first"
  },
  {
    key: "floorplan_222_east_terrace",
    path: "C:\\Users\\lenovo\\Desktop\\222eastterracefloor.webp",
    category: "floorplans",
    title: "222 SQ YDS East Facing - Terrace Floor Plan",
    public_id: "maytri_ambhuja/floorplans/222_east_terrace"
  }
];

async function run() {
  await connectDB();
  console.log("Connected to MongoDB Atlas");

  const results = {};

  for (const item of floorplanFiles) {
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

  console.log("All floor plans uploaded & registered in MongoDB successfully!");
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

run().catch(err => {
  console.error("Upload error:", err);
  process.exit(1);
});
