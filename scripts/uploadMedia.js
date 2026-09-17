import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.js";
import { connectDB } from "../config/db.js";
import { Media } from "../models/Media.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, "../../my-app/public");

const MEDIA_FILES = [
  // Brand Assets
  {
    key: "logo",
    filePath: path.join(PUBLIC_DIR, "ambhuja-logo.png"),
    sourceUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786505/maytri_ambhuja/brand/ambhuja_logo.png",
    resourceType: "image",
    folder: "maytri_ambhuja/brand",
    publicId: "ambhuja_logo",
    title: "Maytri Ambhuja Brand Logo",
    category: "logo",
  },
  {
    key: "heroPoster",
    filePath: path.join(PUBLIC_DIR, "hero-bg.png"),
    sourceUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786507/maytri_ambhuja/brand/hero_poster.jpg",
    resourceType: "image",
    folder: "maytri_ambhuja/brand",
    publicId: "hero_poster",
    title: "Hero Background Poster",
    category: "image",
  },
  {
    key: "heroBgImage",
    filePath: path.join(PUBLIC_DIR, "hero-bg.png"),
    sourceUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786507/maytri_ambhuja/brand/hero_poster.jpg",
    resourceType: "image",
    folder: "maytri_ambhuja/brand",
    publicId: "hero_poster",
    title: "Hero Background Poster",
    category: "image",
  },
  {
    key: "ctaPoster",
    filePath: path.join(PUBLIC_DIR, "cta-bg.jpg"),
    sourceUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786509/maytri_ambhuja/brand/cta_poster.jpg",
    resourceType: "image",
    folder: "maytri_ambhuja/brand",
    publicId: "cta_poster",
    title: "CTA Background Poster",
    category: "image",
  },
  {
    key: "ctaBgImage",
    filePath: path.join(PUBLIC_DIR, "cta-bg.jpg"),
    sourceUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786509/maytri_ambhuja/brand/cta_poster.jpg",
    resourceType: "image",
    folder: "maytri_ambhuja/brand",
    publicId: "cta_poster",
    title: "CTA Background Poster",
    category: "image",
  },
  // Gallery Images 001 - 010
  {
    key: "gallery001",
    filePath: path.join(PUBLIC_DIR, "images/001.jpeg"),
    sourceUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786512/maytri_ambhuja/gallery/gallery_001.jpg",
    resourceType: "image",
    folder: "maytri_ambhuja/gallery",
    publicId: "gallery_001",
    title: "Grand Clubhouse Architecture",
    category: "image",
  },
  {
    key: "gallery002",
    filePath: path.join(PUBLIC_DIR, "images/002.jpeg"),
    sourceUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786514/maytri_ambhuja/gallery/gallery_002.jpg",
    resourceType: "image",
    folder: "maytri_ambhuja/gallery",
    publicId: "gallery_002",
    title: "Temperature-Controlled Infinity Pool",
    category: "image",
  },
  {
    key: "gallery003",
    filePath: path.join(PUBLIC_DIR, "images/003.jpeg"),
    sourceUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786516/maytri_ambhuja/gallery/gallery_003.jpg",
    resourceType: "image",
    folder: "maytri_ambhuja/gallery",
    publicId: "gallery_003",
    title: "Holistic Wellness Spa & Steam Pavilion",
    category: "image",
  },
  {
    key: "gallery004",
    filePath: path.join(PUBLIC_DIR, "images/004.jpeg"),
    sourceUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786517/maytri_ambhuja/gallery/gallery_004.jpg",
    resourceType: "image",
    folder: "maytri_ambhuja/gallery",
    publicId: "gallery_004",
    title: "Double-Height Grand Celebration Banquet",
    category: "image",
  },
  {
    key: "gallery005",
    filePath: path.join(PUBLIC_DIR, "images/005.jpeg"),
    sourceUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786519/maytri_ambhuja/gallery/gallery_005.jpg",
    resourceType: "image",
    folder: "maytri_ambhuja/gallery",
    publicId: "gallery_005",
    title: "Indoor International Multi-Sport Arena",
    category: "image",
  },
  {
    key: "gallery006",
    filePath: path.join(PUBLIC_DIR, "images/006.jpeg"),
    sourceUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786520/maytri_ambhuja/gallery/gallery_006.jpg",
    resourceType: "image",
    folder: "maytri_ambhuja/gallery",
    publicId: "gallery_006",
    title: "Boutique Executive Air-Conditioned Guest Suites",
    category: "image",
  },
  {
    key: "gallery007",
    filePath: path.join(PUBLIC_DIR, "images/007.jpeg"),
    sourceUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786522/maytri_ambhuja/gallery/gallery_007.jpg",
    resourceType: "image",
    folder: "maytri_ambhuja/gallery",
    publicId: "gallery_007",
    title: "Children Creative Activity Creche & Play Zone",
    category: "image",
  },
  {
    key: "gallery008",
    filePath: path.join(PUBLIC_DIR, "images/008.jpeg"),
    sourceUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786523/maytri_ambhuja/gallery/gallery_008.jpg",
    resourceType: "image",
    folder: "maytri_ambhuja/gallery",
    publicId: "gallery_008",
    title: "Private 4K Dolby Atmos Preview Theatre",
    category: "image",
  },
  {
    key: "gallery009",
    filePath: path.join(PUBLIC_DIR, "images/009.jpeg"),
    sourceUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786525/maytri_ambhuja/gallery/gallery_009.jpg",
    resourceType: "image",
    folder: "maytri_ambhuja/gallery",
    publicId: "gallery_009",
    title: "State-of-the-Art Technogym Fitness Center",
    category: "image",
  },
  {
    key: "gallery010",
    filePath: path.join(PUBLIC_DIR, "images/010.jpeg"),
    sourceUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786526/maytri_ambhuja/gallery/gallery_010.jpg",
    resourceType: "image",
    folder: "maytri_ambhuja/gallery",
    publicId: "gallery_010",
    title: "Starlit Rooftop Sky Lounge & Deck",
    category: "image",
  },
  {
    key: "sanghiLogo",
    filePath: path.join(PUBLIC_DIR, "sanghicity-logo.png"),
    resourceType: "image",
    folder: "maytri_ambhuja/brand",
    publicId: "sanghicity_logo",
    title: "Sanghi City Logo",
    category: "logo",
  },
  // Clubhouse Renders
  {
    key: "clubhouse_front_panorama",
    filePath: path.join(PUBLIC_DIR, "clubhouse/clubhouse_front_panorama.webp"),
    resourceType: "image",
    folder: "maytri_ambhuja/clubhouse",
    publicId: "clubhouse_front_panorama",
    title: "Clubhouse Front Panorama",
    category: "clubhouse",
  },
  {
    key: "clubhouse_pool_aerial",
    filePath: path.join(PUBLIC_DIR, "clubhouse/clubhouse_pool_aerial.webp"),
    resourceType: "image",
    folder: "maytri_ambhuja/clubhouse",
    publicId: "clubhouse_pool_aerial",
    title: "Clubhouse Pool Aerial",
    category: "clubhouse",
  },
  {
    key: "clubhouse_evening_elevation",
    filePath: path.join(PUBLIC_DIR, "clubhouse/clubhouse_evening_elevation.webp"),
    resourceType: "image",
    folder: "maytri_ambhuja/clubhouse",
    publicId: "clubhouse_evening_elevation",
    title: "Clubhouse Evening Elevation",
    category: "clubhouse",
  },
  {
    key: "clubhouse_courtyard_lawn",
    filePath: path.join(PUBLIC_DIR, "clubhouse/clubhouse_courtyard_lawn.webp"),
    resourceType: "image",
    folder: "maytri_ambhuja/clubhouse",
    publicId: "clubhouse_courtyard_lawn",
    title: "Clubhouse Courtyard Lawn",
    category: "clubhouse",
  },
  // Villa Elevations
  {
    key: "elevation01",
    filePath: path.join(PUBLIC_DIR, "elevations/elevation_01.webp"),
    resourceType: "image",
    folder: "maytri_ambhuja/elevations",
    publicId: "elevation_01",
    title: "Villa Elevation 01",
    category: "elevations",
  },
  {
    key: "elevation02",
    filePath: path.join(PUBLIC_DIR, "elevations/elevation_02.webp"),
    resourceType: "image",
    folder: "maytri_ambhuja/elevations",
    publicId: "elevation_02",
    title: "Villa Elevation 02",
    category: "elevations",
  },
  {
    key: "elevation03",
    filePath: path.join(PUBLIC_DIR, "elevations/elevation_03.webp"),
    resourceType: "image",
    folder: "maytri_ambhuja/elevations",
    publicId: "elevation_03",
    title: "Villa Elevation 03",
    category: "elevations",
  },
  {
    key: "elevation04",
    filePath: path.join(PUBLIC_DIR, "elevations/elevation_04.webp"),
    resourceType: "image",
    folder: "maytri_ambhuja/elevations",
    publicId: "elevation_04",
    title: "Villa Elevation 04",
    category: "elevations",
  },
  {
    key: "elevation05",
    filePath: path.join(PUBLIC_DIR, "elevations/elevation_05.webp"),
    resourceType: "image",
    folder: "maytri_ambhuja/elevations",
    publicId: "elevation_05",
    title: "Villa Elevation 05",
    category: "elevations",
  },
  {
    key: "elevation06",
    filePath: path.join(PUBLIC_DIR, "elevations/elevation_06.webp"),
    resourceType: "image",
    folder: "maytri_ambhuja/elevations",
    publicId: "elevation_06",
    title: "Villa Elevation 06",
    category: "elevations",
  },
  {
    key: "elevation07",
    filePath: path.join(PUBLIC_DIR, "elevations/elevation_07.webp"),
    resourceType: "image",
    folder: "maytri_ambhuja/elevations",
    publicId: "elevation_07",
    title: "Villa Elevation 07",
    category: "elevations",
  },
  {
    key: "elevation_pool",
    filePath: path.join(PUBLIC_DIR, "elevations/elevation_pool.webp"),
    resourceType: "image",
    folder: "maytri_ambhuja/elevations",
    publicId: "elevation_pool",
    title: "Elevation Pool",
    category: "elevations",
  },
  {
    key: "elevation_cricket_pitch",
    filePath: path.join(PUBLIC_DIR, "elevations/elevation_cricket_pitch.webp"),
    resourceType: "image",
    folder: "maytri_ambhuja/elevations",
    publicId: "elevation_cricket_pitch",
    title: "Elevation Cricket Pitch",
    category: "elevations",
  },
  {
    key: "elevation_park_day",
    filePath: path.join(PUBLIC_DIR, "elevations/elevation_park_day.webp"),
    resourceType: "image",
    folder: "maytri_ambhuja/elevations",
    publicId: "elevation_park_day",
    title: "Elevation Park Day",
    category: "elevations",
  },
  // Floor Plans
  {
    key: "east222Ground",
    filePath: path.join(PUBLIC_DIR, "floorplans/222east_ground.webp"),
    resourceType: "image",
    folder: "maytri_ambhuja/floorplans",
    publicId: "222_east_ground",
    title: "222 East Ground",
    category: "floorplans",
  },
  {
    key: "east222First",
    filePath: path.join(PUBLIC_DIR, "floorplans/222east_first.webp"),
    resourceType: "image",
    folder: "maytri_ambhuja/floorplans",
    publicId: "222_east_first",
    title: "222 East First",
    category: "floorplans",
  },
  {
    key: "east222Terrace",
    filePath: path.join(PUBLIC_DIR, "floorplans/222east_terrace.webp"),
    resourceType: "image",
    folder: "maytri_ambhuja/floorplans",
    publicId: "222_east_terrace",
    title: "222 East Terrace",
    category: "floorplans",
  },
  {
    key: "west222Ground",
    filePath: path.join(PUBLIC_DIR, "floorplans/222west_ground.jpg"),
    resourceType: "image",
    folder: "maytri_ambhuja/floorplans",
    publicId: "222_west_ground",
    title: "222 West Ground",
    category: "floorplans",
  },
  {
    key: "west222First",
    filePath: path.join(PUBLIC_DIR, "floorplans/222west_first.jpg"),
    resourceType: "image",
    folder: "maytri_ambhuja/floorplans",
    publicId: "222_west_first",
    title: "222 West First",
    category: "floorplans",
  },
  {
    key: "west222Terrace",
    filePath: path.join(PUBLIC_DIR, "floorplans/222west_terrace.jpg"),
    resourceType: "image",
    folder: "maytri_ambhuja/floorplans",
    publicId: "222_west_terrace",
    title: "222 West Terrace",
    category: "floorplans",
  },
  {
    key: "east300Ground",
    filePath: path.join(PUBLIC_DIR, "floorplans/300east_ground.jpg"),
    resourceType: "image",
    folder: "maytri_ambhuja/floorplans",
    publicId: "300_east_ground",
    title: "300 East Ground",
    category: "floorplans",
  },
  {
    key: "east300First",
    filePath: path.join(PUBLIC_DIR, "floorplans/300east_first.jpg"),
    resourceType: "image",
    folder: "maytri_ambhuja/floorplans",
    publicId: "300_east_first",
    title: "300 East First",
    category: "floorplans",
  },
  {
    key: "east300Terrace",
    filePath: path.join(PUBLIC_DIR, "floorplans/300east_terrace.jpg"),
    resourceType: "image",
    folder: "maytri_ambhuja/floorplans",
    publicId: "300_east_terrace",
    title: "300 East Terrace",
    category: "floorplans",
  },
  {
    key: "west300Ground",
    filePath: path.join(PUBLIC_DIR, "floorplans/300west_ground.jpg"),
    resourceType: "image",
    folder: "maytri_ambhuja/floorplans",
    publicId: "300_west_ground",
    title: "300 West Ground",
    category: "floorplans",
  },
  {
    key: "west300First",
    filePath: path.join(PUBLIC_DIR, "floorplans/300west_first.jpg"),
    resourceType: "image",
    folder: "maytri_ambhuja/floorplans",
    publicId: "300_west_first",
    title: "300 West First",
    category: "floorplans",
  },
  {
    key: "west300Terrace",
    filePath: path.join(PUBLIC_DIR, "floorplans/300west_terrace.jpg"),
    resourceType: "image",
    folder: "maytri_ambhuja/floorplans",
    publicId: "300_west_terrace",
    title: "300 West Terrace",
    category: "floorplans",
  },
  // Videos
  {
    key: "heroVideo",
    filePath: path.join(PUBLIC_DIR, "am-web-video-22.mp4"),
    sourceUrl: "https://res.cloudinary.com/s8b4ps7b/video/upload/maytri_ambhuja/videos/hero_video.mp4",
    resourceType: "video",
    folder: "maytri_ambhuja/videos",
    publicId: "hero_video",
    title: "Maytri Ambhuja Hero Video",
    category: "video",
  },
  {
    key: "ctaVideo",
    filePath: path.join(PUBLIC_DIR, "cta-bg.mp4"),
    sourceUrl: "https://res.cloudinary.com/s8b4ps7b/video/upload/maytri_ambhuja/videos/cta_video.mp4",
    resourceType: "video",
    folder: "maytri_ambhuja/videos",
    publicId: "cta_video",
    title: "Maytri Ambhuja CTA Video",
    category: "video",
  },
];

export async function uploadAllMedia() {
  console.log(`☁️ Connected to Cloudinary Cloud: ${cloudinary.config().cloud_name}`);
  const uploadedResults = {};

  for (const item of MEDIA_FILES) {
    let targetUploadSource = null;

    if (fs.existsSync(item.filePath)) {
      targetUploadSource = item.filePath;
    } else if (item.sourceUrl) {
      targetUploadSource = item.sourceUrl;
    } else {
      console.warn(`⚠️ Skipping missing source for: ${item.key}`);
      continue;
    }

    try {
      console.log(`📤 Uploading [${item.category.toUpperCase()}] ${item.key} to Cloudinary (${item.publicId})...`);

      let uploadResult;
      if (item.resourceType === "video") {
        uploadResult = await cloudinary.uploader.upload_large(targetUploadSource, {
          resource_type: "video",
          folder: item.folder,
          public_id: item.publicId,
          overwrite: true,
          chunk_size: 6000000, // 6MB chunk size
        });
      } else {
        uploadResult = await cloudinary.uploader.upload(targetUploadSource, {
          resource_type: "image",
          folder: item.folder,
          public_id: item.publicId,
          overwrite: true,
        });
      }

      console.log(`✅ Success: ${item.key} -> ${uploadResult.secure_url}`);
      uploadedResults[item.key] = uploadResult.secure_url;

      // Sync to MongoDB
      await Media.findOneAndUpdate(
        { key: item.key },
        {
          key: item.key,
          title: item.title,
          category: item.category,
          cloudinaryUrl: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          format: uploadResult.format,
          resourceType: uploadResult.resource_type,
          bytes: uploadResult.bytes,
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error(`❌ Upload failed for ${item.key}:`, err.message);
    }
  }

  console.log("🎉 All media uploaded to Cloudinary and MongoDB successfully!");
  return uploadedResults;
}

if (process.argv[1] && process.argv[1].endsWith("uploadMedia.js")) {
  (async () => {
    await connectDB();
    const map = await uploadAllMedia();
    console.log("Generated Cloudinary Media Map:", JSON.stringify(map, null, 2));
    process.exit(0);
  })();
}
