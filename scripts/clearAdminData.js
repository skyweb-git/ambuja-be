import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Lead } from "../models/Lead.js";
import { CallLog } from "../models/CallLog.js";
import { EmailLog } from "../models/EmailLog.js";
import { SessionLog } from "../models/SessionLog.js";

dotenv.config();

const clearAdminData = async () => {
  try {
    const conn = await connectDB();
    if (!conn) {
      console.error("Failed to connect to database.");
      process.exit(1);
    }

    console.log("Purging CRM admin operational data...");

    const leadsRes = await Lead.deleteMany({});
    console.log(`Deleted ${leadsRes.deletedCount} leads.`);

    const callLogsRes = await CallLog.deleteMany({});
    console.log(`Deleted ${callLogsRes.deletedCount} call logs.`);

    const emailLogsRes = await EmailLog.deleteMany({});
    console.log(`Deleted ${emailLogsRes.deletedCount} email logs.`);

    const sessionLogsRes = await SessionLog.deleteMany({});
    console.log(`Deleted ${sessionLogsRes.deletedCount} session logs.`);

    console.log("Admin operational data cleared successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing admin data:", error);
    process.exit(1);
  }
};

clearAdminData();
