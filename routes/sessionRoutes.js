import express from "express";
import {
  recordLogin,
  sendHeartbeat,
  recordLogout,
  getCentralizedMonitoring,
  getEmployeeSessionDetails,
} from "../controllers/sessionController.js";

const router = express.Router();

// POST /api/sessions/login
router.post("/login", recordLogin);

// POST /api/sessions/heartbeat
router.post("/heartbeat", sendHeartbeat);

// POST /api/sessions/logout
router.post("/logout", recordLogout);

// GET /api/sessions/monitoring
router.get("/monitoring", getCentralizedMonitoring);

// GET /api/sessions/employee/:id
router.get("/employee/:id", getEmployeeSessionDetails);

export default router;
