import express from "express";
import { login, verifyOtp, resendOtp, resetPassword, getAnalytics } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/reset-password", resetPassword);
router.get("/analytics", getAnalytics);

export default router;
