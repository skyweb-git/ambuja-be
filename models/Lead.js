import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
      default: () => "lead-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    preferredMethod: {
      type: String,
      enum: ["Phone", "WhatsApp", "Email"],
      default: "Phone",
    },
    source: {
      type: String,
      default: "Website Enquiry",
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Site Visit Scheduled", "Negotiation", "Converted", "Lost"],
      default: "New",
      index: true,
    },
    unitInterest: {
      type: String,
      default: "Villa Enquiry",
    },
    budget: {
      type: String,
      default: "₹3.8 Cr - ₹5.5 Cr",
    },
    notes: {
      type: String,
      default: "",
    },
    followUpDate: {
      type: String,
      default: "",
    },
    assignedTo: {
      type: String,
      default: null,
      ref: "Employee",
    },
    assignedEmployeeName: {
      type: String,
      default: null,
    },
    assignedToId: {
      type: String,
      default: "",
    },
    assignedToName: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Format JSON response and ensure both alias formats are present
leadSchema.methods.toJSON = function () {
  const obj = this.toObject();
  const assignedId = obj.assignedToId || obj.assignedTo || "";
  const assignedName = obj.assignedToName || obj.assignedEmployeeName || (assignedId ? "Assigned" : "Unassigned");

  return {
    ...obj,
    assignedToId: assignedId,
    assignedToName: assignedName,
    assignedTo: assignedId,
    assignedEmployeeName: assignedName,
    _mongoId: obj._id,
  };
};

export const Lead = mongoose.model("Lead", leadSchema);
