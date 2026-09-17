import express from "express";
import { getCallLogs, logCall, getEmailLogs, logEmail } from "../controllers/activityController.js";

const router = express.Router();

router.get("/calls", getCallLogs);
router.post("/calls", logCall);
router.get("/emails", getEmailLogs);
router.post("/emails", logEmail);

export default router;
