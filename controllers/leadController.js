import mongoose from "mongoose";
import { Lead } from "../models/Lead.js";
import { sendLeadNotification } from "../services/emailService.js";

const buildIdQuery = (id) => {
  if (!id) return { _id: null };
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ id: id }, { _id: id }] };
  }
  return { id: id };
};

// GET /api/leads - Fetch leads with optional search and filters
export const getLeads = async (req, res) => {
  try {
    const { status, search, limit = 100 } = req.query;
    const query = {};

    if (status && status !== "All") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { unitInterest: { $regex: search, $options: "i" } },
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 }).limit(Number(limit));
    res.json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ success: false, message: "Failed to fetch leads", error: error.message });
  }
};

// GET /api/leads/:id
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findOne(buildIdQuery(req.params.id));
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching lead", error: error.message });
  }
};

// POST /api/leads - Create new lead (from website form or admin)
export const createLead = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      preferredMethod,
      source,
      message,
      status,
      unitInterest,
      budget,
      notes,
      followUpDate,
      assignedToId,
      assignedToName,
      assignedTo,
      assignedEmployeeName
    } = req.body;

    if (!phone || !fullName) {
      return res.status(400).json({ success: false, message: "Full name and Phone are required." });
    }

    const assignedId = assignedToId || assignedTo || "";
    const assignedName = assignedToName || assignedEmployeeName || "";

    const newLead = new Lead({
      id: req.body.id || ("lead-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6)),
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: (email || "").trim().toLowerCase(),
      preferredMethod: preferredMethod || "Phone",
      source: source || "Website Enquiry",
      message: message || "",
      status: status || "New",
      unitInterest: unitInterest || "Villa Enquiry",
      budget: budget || "₹3.8 Cr - ₹5.5 Cr",
      notes: notes || "Submitted via landing page.",
      followUpDate: followUpDate || new Date().toISOString().split("T")[0],
      assignedToId: assignedId,
      assignedToName: assignedName,
      assignedTo: assignedId,
      assignedEmployeeName: assignedName,
    });

    const savedLead = await newLead.save();

    // Trigger asynchronous lead alert email to admin
    sendLeadNotification(savedLead).catch((err) =>
      console.error("Async lead email alert error:", err.message)
    );

    res.status(201).json({ success: true, message: "Lead saved successfully", data: savedLead });
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ success: false, message: "Failed to create lead", error: error.message });
  }
};

// PUT /api/leads/:id - Update lead (including employee assignment)
export const updateLead = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Sync assignment alias fields
    if (updates.assignedToId !== undefined) {
      updates.assignedTo = updates.assignedToId;
    } else if (updates.assignedTo !== undefined) {
      updates.assignedToId = updates.assignedTo;
    }

    if (updates.assignedToName !== undefined) {
      updates.assignedEmployeeName = updates.assignedToName;
    } else if (updates.assignedEmployeeName !== undefined) {
      updates.assignedToName = updates.assignedEmployeeName;
    }

    const lead = await Lead.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.json({ success: true, message: "Lead updated", data: lead });
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({ success: false, message: "Failed to update lead", error: error.message });
  }
};

// DELETE /api/leads/:id
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete(buildIdQuery(req.params.id));
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    res.json({ success: true, message: "Lead deleted successfully", data: { id: req.params.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete lead", error: error.message });
  }
};
