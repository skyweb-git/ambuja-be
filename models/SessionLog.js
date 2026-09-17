import mongoose from "mongoose";

const sessionLogSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => "sess-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    },
    employeeId: {
      type: String,
      required: true,
      index: true,
    },
    employeeEmail: {
      type: String,
      required: true,
      index: true,
    },
    employeeName: {
      type: String,
      default: "Employee",
    },
    role: {
      type: String,
      default: "employee",
    },
    loginTime: {
      type: Date,
      default: Date.now,
      index: true,
    },
    logoutTime: {
      type: Date,
      default: null,
    },
    lastActiveTime: {
      type: Date,
      default: Date.now,
    },
    activeScreenSeconds: {
      type: Number,
      default: 0,
    },
    idleSeconds: {
      type: Number,
      default: 0,
    },
    durationSeconds: {
      type: Number,
      default: 0,
    },
    ipAddress: {
      type: String,
      default: "Localhost",
    },
    userAgent: {
      type: String,
      default: "Web Browser",
    },
    status: {
      type: String,
      enum: ["Active", "Idle", "Logged Out"],
      default: "Active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SessionLog = mongoose.model("SessionLog", sessionLogSchema);
