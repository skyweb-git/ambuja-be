import cloudinary from "./config/cloudinary.js";
import { connectDB } from "./config/db.js";
import { Media } from "./models/Media.js";

const westFloorplanFiles = [
  {
    key: "floorplan_222_west_ground",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\floorplans\\222west_ground.jpg",
    category: "floorplans",
    title: "222 SQ YDS West Facing - Ground Floor Plan",
    public_id: "maytri_ambhuja/floorplans/222_west_ground"
  },
  {
    key: "floorplan_222_west_first",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\floorplans\\222west_first.jpg",
    category: "floorplans",
    title: "222 SQ YDS West Facing - First Floor Plan",
    public_id: "maytri_ambhuja/floorplans/222_west_first"
  },
  {
    key: "floorplan_222_west_terrace",
    path: "C:\\Users\\lenovo\\Desktop\\--\\finace projcet\\my-app\\public\\floorplans\\222west_terrace.jpg",
    category: "floorplans",
    title: "222 SQ YDS West Facing - Terrace Floor Plan",
    public_id: "maytri_ambhuja/floorplans/222_west_terrace"
  }
];

async function run() {
  await connectDB();
  console.log("Connected to MongoDB Atlas");

  const results = {};

  for (const item of westFloorplanFiles) {
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

  console.log("All West floor plans uploaded & registered successfully!");
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

run().catch(err => {
  console.error("Upload error:", err);
  process.exit(1);
});
