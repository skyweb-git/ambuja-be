import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
      default: () => "mail-" + Date.now().toString(36),
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
    leadEmail: {
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
      default: "Marketing Executive",
    },
    templateType: {
      type: String,
      default: "Digital Project Kit & Master Plan",
    },
    subject: {
      type: String,
      default: "Maytri Ambhuja Villa Township Enquiry",
    },
    preview: {
      type: String,
      default: "",
    },
    body: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Delivered",
    },
    sentAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const EmailLog = mongoose.model("EmailLog", emailLogSchema);
