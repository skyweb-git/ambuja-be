import express from "express";
import { getAllMedia, getMediaByKey, uploadMediaAsset, updateMedia } from "../controllers/mediaController.js";

const router = express.Router();

router.get("/", getAllMedia);
router.post("/upload", uploadMediaAsset);
router.get("/:key", getMediaByKey);
router.put("/:key", updateMedia);

export default router;

