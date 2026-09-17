import mongoose from "mongoose";

const callLogSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
      default: () => "call-" + Date.now().toString(36),
    },
    leadId: {
      type: String,
      required: true,
      index: true,
    },
    leadName: {
      type: String,
      default: "Prospect",
    },
    leadPhone: {
      type: String,
      default: "",
    },
    employeeId: {
      type: String,
      required: true,
      index: true,
    },
    employeeName: {
      type: String,
      default: "Staff Member",
    },
    employeeDept: {
      type: String,
      default: "Marketing & Sales",
    },
    outcome: {
      type: String,
      default: "Connected - Interested",
    },
    duration: {
      type: String,
      default: "2 mins 30 secs",
    },
    durationSec: {
      type: Number,
      default: 150,
    },
    notes: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CallLog = mongoose.model("CallLog", callLogSchema);
