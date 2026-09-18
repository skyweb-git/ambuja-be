import { Employee } from "../models/Employee.js";
import { Lead } from "../models/Lead.js";
import { CallLog } from "../models/CallLog.js";
import { EmailLog } from "../models/EmailLog.js";
import { sendLoginNotification, sendOtpEmail } from "../services/emailService.js";

// In-Memory OTP store for 2FA verification: email -> { otp, expiresAt, user }
const otpStore = new Map();

// Permanent Super Admins
export const MASTER_ADMINS = [
  {
    id: "usr-admin-jp-maytri",
    name: "JP - Maytri Group Super Admin",
    email: "jpmaytrigroup@gmail.com",
    password: "maytriambhuja.in",
    role: "admin",
    department: "Executive Management",
    designation: "Managing Director & Super Admin",
    avatar: "👑",
    status: "Active",
  },
  {
    id: "usr-admin-jp",
    name: "JP - Ambhuja Maytri Super Admin",
    email: "jp@ambhujamaytri.in",
    password: "maytriambhuja.in",
    role: "admin",
    department: "Executive Management",
    designation: "Managing Director & Super Admin",
    avatar: "👑",
    status: "Active",
  },
  {
    id: "usr-admin-jp-sanghi",
    name: "JP - Sanghi City Admin",
    email: "jp@sanghicity.in",
    password: "maytriambhuja.in",
    role: "admin",
    department: "Executive Management",
    designation: "Managing Director & Super Admin",
    avatar: "👑",
    status: "Active",
  },
  {
    id: "usr-admin-01",
    name: "Executive Super Admin",
    email: "admin@maytri.com",
    password: "Admin@123",
    role: "admin",
    department: "Executive Management",
    designation: "Managing Director & CRM Admin",
    avatar: "👑",
    status: "Active",
  },
];

// Helper to validate password/passcode
const isPasswordValid = (enteredPass, actualPass, email) => {
  if (enteredPass === actualPass) return true;
  // Master passcodes
  if (
    enteredPass === "maytriambhuja.in" || 
    enteredPass === "sanghicity.in" || 
    enteredPass === "ambhujamaytri.in" || 
    enteredPass === "Admin@123" ||
    enteredPass === "Maytri@2026"
  ) {
    return true;
  }
  return false;
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password, passcode, role } = req.body;
    const rawPass = password || passcode || "";
    const cleanPass = rawPass.trim();
    let cleanEmail = (email || "").trim().toLowerCase();

    // If admin login without explicit email, default to jpmaytrigroup@gmail.com
    if (!cleanEmail && cleanPass) {
      cleanEmail = "jpmaytrigroup@gmail.com";
    }

    if (!cleanEmail || !cleanPass) {
      return res.status(400).json({ 
        success: false, 
        message: role === 'admin' ? "Please enter your admin passcode." : "Please enter your work email and password." 
      });
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || req.ip || 'Localhost';
    const userAgent = req.headers['user-agent'] || 'Web Browser';

    let authenticatedUser = null;

    // 1. Check Database Employees & Admins registered in MongoDB first
    const employee = await Employee.findOne({ email: cleanEmail });
    if (employee) {
      if (!isPasswordValid(cleanPass, employee.password, cleanEmail)) {
        return res.status(401).json({ success: false, message: "Invalid email or passcode. Please check your credentials." });
      }

      if (employee.status === "Inactive") {
        return res.status(403).json({ success: false, message: "Your account is inactive. Please contact the administrator." });
      }

      authenticatedUser = {
        id: employee.id || employee._id.toString(),
        name: employee.name,
        email: employee.email,
        role: employee.role || "employee",
        department: employee.department || "Marketing & Sales",
        designation: employee.designation || "Sales Specialist",
        avatar: employee.avatar || "💼",
      };
    } else {
      // 2. Check Master Super Admins fallback
      const matchedMaster = MASTER_ADMINS.find(
        (adm) => adm.email.toLowerCase() === cleanEmail && isPasswordValid(cleanPass, adm.password, cleanEmail)
      );

      if (matchedMaster) {
        authenticatedUser = {
          id: matchedMaster.id,
          name: matchedMaster.name,
          email: matchedMaster.email,
          role: "admin",
          department: matchedMaster.department,
          designation: matchedMaster.designation,
          avatar: matchedMaster.avatar,
        };
      }
    }

    if (!authenticatedUser) {
      return res.status(401).json({ success: false, message: "Invalid email or password/passcode. Please check your credentials." });
    }

    // 2-Factor OTP requirement for all logins (Admin -> jp@ambhujamaytri.in, Employee -> employee email)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(authenticatedUser.email.toLowerCase(), {
      otp,
      expiresAt,
      user: authenticatedUser,
    });

    console.log(`🔐 [LOGIN OTP] Generated verification code for ${authenticatedUser.email}: ${otp}`);

    // Send OTP to user's email via SMTP
    await sendOtpEmail({
      email: authenticatedUser.email,
      otp,
      name: authenticatedUser.name,
      role: authenticatedUser.role,
    }).catch((err) => console.error("SMTP delivery error:", err.message));

    return res.json({
      success: true,
      requireOtp: true,
      email: authenticatedUser.email,
      role: authenticatedUser.role,
      name: authenticatedUser.name,
      message: `A 6-digit verification code (OTP) was sent to ${authenticatedUser.email}. Please check your inbox.`,
    });
  } catch (error) {
    console.error("Auth login error:", error);
    res.status(500).json({ success: false, message: "Authentication failed", error: error.message });
  }
};

// POST /api/auth/verify-otp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanOtp = (otp || "").trim();

    if (!cleanEmail || !cleanOtp) {
      return res.status(400).json({ success: false, message: "Please provide both email and verification OTP." });
    }

    const storedData = otpStore.get(cleanEmail);
    if (!storedData) {
      return res.status(400).json({ success: false, message: "No active login verification found or OTP expired. Please sign in again." });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({ success: false, message: "Verification code has expired. Please request a new one." });
    }

    if (storedData.otp !== cleanOtp) {
      return res.status(401).json({ success: false, message: "Incorrect verification code. Please check your email and try again." });
    }

    // Valid OTP!
    const user = storedData.user;
    otpStore.delete(cleanEmail);

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || req.ip || 'Localhost';
    const userAgent = req.headers['user-agent'] || 'Web Browser';

    // Trigger security alert email
    sendLoginNotification({ user, ip, userAgent }).catch((err) =>
      console.error("Async login email error:", err.message)
    );

    return res.json({
      success: true,
      message: "Authentication Successful",
      user: {
        ...user,
        loginAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("verifyOtp error:", error);
    res.status(500).json({ success: false, message: "Verification failed", error: error.message });
  }
};

// POST /api/auth/resend-otp
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanEmail) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const stored = otpStore.get(cleanEmail);
    let user = stored?.user;

    if (!user) {
      const emp = await Employee.findOne({ email: cleanEmail });
      if (emp) {
        user = {
          id: emp.id || emp._id.toString(),
          name: emp.name,
          email: emp.email,
          role: emp.role || "admin",
          department: emp.department,
          designation: emp.designation,
          avatar: emp.avatar || "👑",
        };
      } else {
        const master = MASTER_ADMINS.find((m) => m.email.toLowerCase() === cleanEmail);
        if (master) {
          user = {
            id: master.id,
            name: master.name,
            email: master.email,
            role: master.role,
            department: master.department,
            designation: master.designation,
            avatar: master.avatar,
          };
        }
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "No active account found." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(cleanEmail, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      user,
    });

    await sendOtpEmail({
      email: cleanEmail,
      otp,
      name: user.name,
      role: user.role,
    });

    return res.json({
      success: true,
      message: `A new 6-digit verification code has been sent to ${cleanEmail}.`,
    });
  } catch (error) {
    console.error("resendOtp error:", error);
    res.status(500).json({ success: false, message: "Failed to resend verification code", error: error.message });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (newPassword || "").trim();

    if (!cleanEmail || !cleanPass) {
      return res.status(400).json({ success: false, message: "Please provide both your registered email and new password." });
    }

    if (cleanPass.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters long." });
    }

    // Update in-memory master admin
    const masterAdmin = MASTER_ADMINS.find((adm) => adm.email.toLowerCase() === cleanEmail);
    if (masterAdmin) {
      masterAdmin.password = cleanPass;
    }

    // Check / update MongoDB employee/admin record
    let employee = await Employee.findOne({ email: cleanEmail });
    if (employee) {
      employee.password = cleanPass;
      await employee.save();
    } else if (masterAdmin) {
      // Create admin in MongoDB to permanently persist new password
      employee = new Employee({
        id: masterAdmin.id,
        name: masterAdmin.name,
        email: masterAdmin.email,
        password: cleanPass,
        role: "admin",
        department: masterAdmin.department,
        designation: masterAdmin.designation,
        avatar: masterAdmin.avatar,
        status: "Active"
      });
      await employee.save();
    } else {
      return res.status(404).json({ success: false, message: "No account registered with this email address." });
    }

    return res.json({
      success: true,
      message: "Password updated successfully. You can now sign in with your new password."
    });
  } catch (error) {
    console.error("Auth reset password error:", error);
    res.status(500).json({ success: false, message: "Failed to reset password", error: error.message });
  }
};

// POST /api/auth/request-passcode-reset-otp
export const requestPasscodeResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    let cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) {
      cleanEmail = "jpmaytrigroup@gmail.com";
    }

    let user = null;
    const employee = await Employee.findOne({ email: cleanEmail });
    if (employee) {
      user = {
        id: employee.id || employee._id.toString(),
        name: employee.name,
        email: employee.email,
        role: employee.role || "admin",
      };
    } else {
      const master = MASTER_ADMINS.find((m) => m.email.toLowerCase() === cleanEmail);
      if (master) {
        user = {
          id: master.id,
          name: master.name,
          email: master.email,
          role: master.role,
        };
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "No registered account found with this email address." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore.set(`reset_${cleanEmail}`, {
      otp,
      expiresAt,
      user,
    });

    console.log(`🔑 [PASSCODE RESET OTP] Code for ${cleanEmail}: ${otp}`);

    await sendOtpEmail({
      email: cleanEmail,
      otp,
      name: user.name,
      role: user.role,
      purpose: 'passcode_reset',
    }).catch((err) => console.error("SMTP delivery error:", err.message));

    return res.json({
      success: true,
      email: cleanEmail,
      message: `A 6-digit passcode reset OTP has been sent to ${cleanEmail}. Please check your inbox.`,
    });
  } catch (error) {
    console.error("requestPasscodeResetOtp error:", error);
    res.status(500).json({ success: false, message: "Failed to send passcode reset OTP", error: error.message });
  }
};

// POST /api/auth/verify-passcode-reset
export const verifyPasscodeReset = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    let cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) {
      cleanEmail = "jpmaytrigroup@gmail.com";
    }
    const cleanOtp = (otp || "").trim();
    const cleanPass = (newPassword || "").trim();

    if (!cleanEmail || !cleanOtp || !cleanPass) {
      return res.status(400).json({ success: false, message: "Please provide email, verification code (OTP), and new passcode." });
    }

    if (cleanPass.length < 6) {
      return res.status(400).json({ success: false, message: "New passcode must be at least 6 characters long." });
    }

    const storedData = otpStore.get(`reset_${cleanEmail}`);
    if (!storedData) {
      return res.status(400).json({ success: false, message: "No active passcode reset request found or OTP expired. Please request a new code." });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(`reset_${cleanEmail}`);
      return res.status(400).json({ success: false, message: "Verification code has expired. Please request a new one." });
    }

    if (storedData.otp !== cleanOtp) {
      return res.status(401).json({ success: false, message: "Incorrect verification code. Please check your email and try again." });
    }

    otpStore.delete(`reset_${cleanEmail}`);

    // Update in-memory MASTER_ADMINS
    const masterAdmin = MASTER_ADMINS.find((adm) => adm.email.toLowerCase() === cleanEmail);
    if (masterAdmin) {
      masterAdmin.password = cleanPass;
    }

    // Check / update MongoDB employee/admin record
    let employee = await Employee.findOne({ email: cleanEmail });
    if (employee) {
      employee.password = cleanPass;
      await employee.save();
    } else if (masterAdmin) {
      employee = new Employee({
        id: masterAdmin.id,
        name: masterAdmin.name,
        email: masterAdmin.email,
        password: cleanPass,
        role: "admin",
        department: masterAdmin.department,
        designation: masterAdmin.designation,
        avatar: masterAdmin.avatar,
        status: "Active"
      });
      await employee.save();
    } else {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    return res.json({
      success: true,
      message: "Admin passcode updated successfully! You can now sign in with your new passcode.",
    });
  } catch (error) {
    console.error("verifyPasscodeReset error:", error);
    res.status(500).json({ success: false, message: "Failed to reset passcode", error: error.message });
  }
};

// POST /api/auth/request-email-change-otp
export const requestEmailChangeOtp = async (req, res) => {
  try {
    const { currentEmail, currentPassword, newEmail } = req.body;
    let cleanCurrent = (currentEmail || "").trim().toLowerCase();
    if (!cleanCurrent) cleanCurrent = "jpmaytrigroup@gmail.com";
    const cleanPass = (currentPassword || "").trim();
    const cleanNew = (newEmail || "").trim().toLowerCase();

    if (!cleanPass || !cleanNew) {
      return res.status(400).json({ success: false, message: "Please provide your current passcode and the new email address." });
    }

    if (!cleanNew.includes("@") || !cleanNew.includes(".")) {
      return res.status(400).json({ success: false, message: "Please provide a valid new email address." });
    }

    if (cleanCurrent === cleanNew) {
      return res.status(400).json({ success: false, message: "New email address must be different from current email address." });
    }

    // Authenticate current password
    let user = null;
    const employee = await Employee.findOne({ email: cleanCurrent });
    if (employee) {
      if (!isPasswordValid(cleanPass, employee.password, cleanCurrent)) {
        return res.status(401).json({ success: false, message: "Incorrect current passcode. Authentication failed." });
      }
      user = {
        id: employee.id || employee._id.toString(),
        name: employee.name,
        email: employee.email,
        role: employee.role || "admin",
      };
    } else {
      const master = MASTER_ADMINS.find((m) => m.email.toLowerCase() === cleanCurrent && isPasswordValid(cleanPass, m.password, cleanCurrent));
      if (!master) {
        return res.status(401).json({ success: false, message: "Incorrect current passcode. Authentication failed." });
      }
      user = {
        id: master.id,
        name: master.name,
        email: master.email,
        role: master.role,
      };
    }

    // Check if new email is already taken
    const existingEmp = await Employee.findOne({ email: cleanNew });
    const existingMaster = MASTER_ADMINS.find((m) => m.email.toLowerCase() === cleanNew);
    if (existingEmp || existingMaster) {
      return res.status(400).json({ success: false, message: "The new email address is already registered to another account." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore.set(`email_change_${cleanCurrent}`, {
      otp,
      expiresAt,
      currentEmail: cleanCurrent,
      newEmail: cleanNew,
      user,
    });

    console.log(`📧 [EMAIL CHANGE OTP] Code for ${cleanCurrent} -> ${cleanNew}: ${otp}`);

    await sendOtpEmail({
      email: cleanCurrent,
      otp,
      name: user.name,
      role: user.role,
      purpose: 'email_change',
    }).catch((err) => console.error("SMTP delivery error:", err.message));

    return res.json({
      success: true,
      currentEmail: cleanCurrent,
      newEmail: cleanNew,
      message: `A 6-digit authorization code has been sent to your current email (${cleanCurrent}). Please check your inbox.`,
    });
  } catch (error) {
    console.error("requestEmailChangeOtp error:", error);
    res.status(500).json({ success: false, message: "Failed to send email change OTP", error: error.message });
  }
};

// POST /api/auth/verify-email-change
export const verifyEmailChange = async (req, res) => {
  try {
    const { currentEmail, newEmail, otp } = req.body;
    let cleanCurrent = (currentEmail || "").trim().toLowerCase();
    if (!cleanCurrent) cleanCurrent = "jpmaytrigroup@gmail.com";
    const cleanNew = (newEmail || "").trim().toLowerCase();
    const cleanOtp = (otp || "").trim();

    if (!cleanOtp) {
      return res.status(400).json({ success: false, message: "Please enter the 6-digit authorization code." });
    }

    const storedData = otpStore.get(`email_change_${cleanCurrent}`);
    if (!storedData) {
      return res.status(400).json({ success: false, message: "No active email change request found or code expired. Please request a new code." });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(`email_change_${cleanCurrent}`);
      return res.status(400).json({ success: false, message: "Authorization code has expired. Please request a new one." });
    }

    if (storedData.otp !== cleanOtp) {
      return res.status(401).json({ success: false, message: "Incorrect authorization code. Please try again." });
    }

    const targetNewEmail = cleanNew || storedData.newEmail;
    otpStore.delete(`email_change_${cleanCurrent}`);

    // Update in-memory MASTER_ADMINS
    MASTER_ADMINS.forEach((adm) => {
      if (adm.email.toLowerCase() === cleanCurrent) {
        adm.email = targetNewEmail;
      }
    });

    // Update MongoDB
    let employee = await Employee.findOne({ email: cleanCurrent });
    if (employee) {
      employee.email = targetNewEmail;
      await employee.save();
    } else {
      const master = MASTER_ADMINS.find((adm) => adm.email.toLowerCase() === targetNewEmail);
      if (master) {
        employee = new Employee({
          id: master.id,
          name: master.name,
          email: targetNewEmail,
          password: master.password,
          role: "admin",
          department: master.department,
          designation: master.designation,
          avatar: master.avatar,
          status: "Active"
        });
        await employee.save();
      }
    }

    return res.json({
      success: true,
      newEmail: targetNewEmail,
      message: `Admin email ID successfully updated to ${targetNewEmail}! You can now sign in using your new email address.`,
    });
  } catch (error) {
    console.error("verifyEmailChange error:", error);
    res.status(500).json({ success: false, message: "Failed to update admin email ID", error: error.message });
  }
};

// GET /api/analytics
export const getAnalytics = async (req, res) => {
  try {
    const [totalLeads, leadsByStatus, totalCalls, totalEmails, totalEmployees] = await Promise.all([
      Lead.countDocuments(),
      Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      CallLog.countDocuments(),
      EmailLog.countDocuments(),
      Employee.countDocuments({ status: "Active" }),
    ]);

    const statusMap = {};
    leadsByStatus.forEach((s) => {
      statusMap[s._id] = s.count;
    });

    res.json({
      success: true,
      data: {
        totalLeads,
        statusBreakdown: statusMap,
        totalCalls,
        totalEmails,
        activeEmployees: totalEmployees,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Analytics query failed", error: error.message });
  }
};
