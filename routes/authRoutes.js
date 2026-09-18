import express from "express";
import {
  login,
  verifyOtp,
  resendOtp,
  resetPassword,
  requestPasscodeResetOtp,
  verifyPasscodeReset,
  requestEmailChangeOtp,
  verifyEmailChange,
  getAnalytics
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/reset-password", resetPassword);
router.post("/request-passcode-reset-otp", requestPasscodeResetOtp);
router.post("/verify-passcode-reset", verifyPasscodeReset);
router.post("/request-email-change-otp", requestEmailChangeOtp);
router.post("/verify-email-change", verifyEmailChange);
router.get("/analytics", getAnalytics);

export default router;
