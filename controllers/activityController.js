import { CallLog } from "../models/CallLog.js";
import { EmailLog } from "../models/EmailLog.js";

// GET /api/activity/calls
export const getCallLogs = async (req, res) => {
  try {
    const { employeeId, leadId, limit = 100 } = req.query;
    const query = {};
    if (employeeId) query.employeeId = employeeId;
    if (leadId) query.leadId = leadId;

    const calls = await CallLog.find(query).sort({ timestamp: -1 }).limit(Number(limit));
    res.json({ success: true, count: calls.length, data: calls });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch call logs", error: error.message });
  }
};

// POST /api/activity/calls
export const logCall = async (req, res) => {
  try {
    const { leadId, leadName, leadPhone, employeeId, employeeName, employeeDept, outcome, duration, durationSec, notes } = req.body;

    const call = new CallLog({
      id: req.body.id || ("call-" + Date.now().toString(36)),
      leadId: leadId || "unassigned",
      leadName: leadName || "Prospect",
      leadPhone: leadPhone || "",
      employeeId: employeeId || "emp-unknown",
      employeeName: employeeName || "Staff Member",
      employeeDept: employeeDept || "Marketing & Sales",
      outcome: outcome || "Connected - Interested",
      duration: duration || "2 mins 30 secs",
      durationSec: durationSec || 150,
      notes: notes || "",
    });

    const saved = await call.save();
    res.status(201).json({ success: true, message: "Call logged successfully", data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to log call", error: error.message });
  }
};

// GET /api/activity/emails
export const getEmailLogs = async (req, res) => {
  try {
    const { employeeId, leadId, limit = 100 } = req.query;
    const query = {};
    if (employeeId) query.employeeId = employeeId;
    if (leadId) query.leadId = leadId;

    const emails = await EmailLog.find(query).sort({ sentAt: -1 }).limit(Number(limit));
    res.json({ success: true, count: emails.length, data: emails });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch email logs", error: error.message });
  }
};

// POST /api/activity/emails
export const logEmail = async (req, res) => {
  try {
    const { leadId, leadName, leadEmail, employeeId, employeeName, templateType, subject, preview, body, status } = req.body;

    const email = new EmailLog({
      id: req.body.id || ("mail-" + Date.now().toString(36)),
      leadId: leadId || "unassigned",
      leadName: leadName || "Prospect",
      leadEmail: leadEmail || "",
      employeeId: employeeId || "emp-unknown",
      employeeName: employeeName || "Marketing Executive",
      templateType: templateType || "Digital Project Kit & Master Plan",
      subject: subject || "Maytri Ambhuja Villa Township Enquiry",
      preview: preview || (body ? body.substring(0, 120) + "..." : ""),
      body: body || "",
      status: status || "Delivered",
    });

    const saved = await email.save();
    res.status(201).json({ success: true, message: "Email logged successfully", data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to log email", error: error.message });
  }
};
