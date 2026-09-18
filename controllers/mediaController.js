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

    const type = resourceType || (file.startsWith("data:video") ? "video" : (file.startsWith("data:application/pdf") ? "raw" : "image"));
    const targetFolder = folder || (type === "video" ? "maytri_ambhuja/videos" : (type === "raw" ? "maytri_ambhuja/documents" : "maytri_ambhuja/gallery"));

    const uniquePublicId = `${key}_${Date.now()}`;
    console.log(`📤 Uploading CMS media asset [${key}] to Cloudinary as [${uniquePublicId}]...`);
    const uploadRes = await cloudinary.uploader.upload(file, {
      folder: targetFolder,
      public_id: uniquePublicId,
      resource_type: type,
      overwrite: true,
    });

    // Clean up previous Cloudinary asset if replaced to save storage quota
    const existingDoc = await Media.findOne({ key });
    if (existingDoc && existingDoc.publicId && existingDoc.publicId !== uploadRes.public_id) {
      const oldType = existingDoc.resourceType || "image";
      console.log(`🗑️ Deleting replaced old asset from Cloudinary: [${existingDoc.publicId}] (${oldType})`);
      try {
        await cloudinary.uploader.destroy(existingDoc.publicId, {
          resource_type: oldType,
          invalidate: true,
        });
      } catch (delErr) {
        console.warn(`⚠️ Failed to remove old Cloudinary asset [${existingDoc.publicId}]:`, delErr.message);
      }
    }

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

    console.log(`✅ CMS Media [${key}] successfully uploaded -> ${uploadRes.secure_url}`);
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

// POST /api/media/register — Lightweight registration of Cloudinary asset metadata
export const registerMediaAsset = async (req, res) => {
  try {
    const { key, title, category, cloudinaryUrl, publicId, format, resourceType, bytes } = req.body;

    if (!key || !cloudinaryUrl) {
      return res.status(400).json({ success: false, message: "Key and cloudinaryUrl are required" });
    }

    // 1. Remove old asset from Cloudinary when replaced to save storage
    const existingDoc = await Media.findOne({ key });
    if (existingDoc && existingDoc.publicId && existingDoc.publicId !== publicId) {
      const oldType = existingDoc.resourceType || "image";
      console.log(`🗑️ Deleting replaced old asset from Cloudinary: [${existingDoc.publicId}] (${oldType})`);
      try {
        const destroyRes = await cloudinary.uploader.destroy(existingDoc.publicId, {
          resource_type: oldType,
          invalidate: true,
        });
        console.log(`🗑️ Cloudinary destroy result for [${existingDoc.publicId}]:`, destroyRes);
      } catch (delErr) {
        console.warn(`⚠️ Failed to remove old Cloudinary asset [${existingDoc.publicId}]:`, delErr.message);
      }
    }

    // 2. Save new asset metadata into MongoDB
    const mediaDoc = await Media.findOneAndUpdate(
      { key },
      {
        key,
        title: title || key,
        category: category || "image",
        cloudinaryUrl,
        publicId: publicId || key,
        format: format || "",
        resourceType: resourceType || "image",
        bytes: bytes || 0,
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Media [${key}] registered → ${cloudinaryUrl}`);
    res.json({
      success: true,
      message: "Media registered successfully",
      data: mediaDoc,
    });
  } catch (error) {
    console.error("Media register error:", error);
    res.status(500).json({ success: false, message: "Failed to register media", error: error.message });
  }
};

// DELETE /api/media/:key
// Deletes media asset from both Cloudinary storage and MongoDB database
export const deleteMediaAsset = async (req, res) => {
  try {
    const { key } = req.params;
    const existingDoc = await Media.findOne({ key });

    if (!existingDoc) {
      return res.status(404).json({ success: false, message: `Media asset [${key}] not found` });
    }

    // Delete from Cloudinary if stored in Cloudinary
    if (existingDoc.publicId) {
      const type = existingDoc.resourceType || "image";
      console.log(`🗑️ Deleting asset from Cloudinary: [${existingDoc.publicId}] (${type})`);
      try {
        await cloudinary.uploader.destroy(existingDoc.publicId, {
          resource_type: type,
          invalidate: true,
        });
      } catch (cloudErr) {
        console.warn(`⚠️ Cloudinary destroy failed: ${cloudErr.message}`);
      }
    }

    // Delete from MongoDB
    await Media.deleteOne({ key });
    console.log(`✅ Media [${key}] deleted from database`);

    res.json({
      success: true,
      message: `Media asset [${key}] deleted successfully from Cloudinary and database`,
    });
  } catch (error) {
    console.error("Delete media error:", error);
    res.status(500).json({ success: false, message: "Failed to delete media asset", error: error.message });
  }
};

