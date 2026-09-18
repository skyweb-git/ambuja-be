import { Media } from "../models/Media.js";
import cloudinary from "../config/cloudinary.js";

// GET /api/media
export const getAllMedia = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const mediaItems = await Media.find(filter).sort({ key: 1 });

    // Map into an easily consumable dictionary as well as an array
    const mediaMap = {};
    mediaItems.forEach((item) => {
      mediaMap[item.key] = item.cloudinaryUrl;
    });

    res.json({
      success: true,
      count: mediaItems.length,
      map: mediaMap,
      data: mediaItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch media", error: error.message });
  }
};

// GET /api/media/:key
export const getMediaByKey = async (req, res) => {
  try {
    const item = await Media.findOne({ key: req.params.key });
    if (!item) {
      return res.status(404).json({ success: false, message: "Media not found" });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching media", error: error.message });
  }
};

// POST /api/media/upload
export const uploadMediaAsset = async (req, res) => {
  try {
    const { key, file, title, category, resourceType, folder } = req.body;

    if (!key || !file) {
      return res.status(400).json({ success: false, message: "Key and file data are required" });
    }

    const type = resourceType || (file.startsWith("data:video") ? "video" : file.startsWith("data:application/pdf") ? "raw" : "image");
    const targetFolder = folder || (type === "video" ? "maytri_ambhuja/videos" : "maytri_ambhuja/gallery");

    console.log(`📤 Uploading CMS media asset [${key}] to Cloudinary...`);
    const uploadRes = await cloudinary.uploader.upload(file, {
      folder: targetFolder,
      public_id: key,
      resource_type: type,
      overwrite: true,
    });

    const mediaDoc = await Media.findOneAndUpdate(
      { key },
      {
        key,
        title: title || key,
        category: category || type,
        cloudinaryUrl: uploadRes.secure_url,
        publicId: uploadRes.public_id,
        format: uploadRes.format,
        resourceType: uploadRes.resource_type,
        bytes: uploadRes.bytes,
      },
      { upsert: true, new: true }
    );

    console.log(`✅ CMS Media [${key}] successfully uploaded to Cloudinary -> ${uploadRes.secure_url}`);
    res.json({
      success: true,
      message: "Media uploaded and registered successfully in Cloudinary",
      data: mediaDoc,
    });
  } catch (error) {
    console.error("CMS Media Upload Error:", error);
    res.status(500).json({ success: false, message: "Cloudinary upload failed: " + error.message, error: error.message });
  }
};

// PUT /api/media/:key
export const updateMedia = async (req, res) => {
  try {
    const { key } = req.params;
    const updates = req.body;
    const mediaDoc = await Media.findOneAndUpdate({ key }, { $set: updates }, { new: true });
    if (!mediaDoc) {
      return res.status(404).json({ success: false, message: "Media asset not found" });
    }
    res.json({ success: true, message: "Media metadata updated", data: mediaDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update media", error: error.message });
  }
};

