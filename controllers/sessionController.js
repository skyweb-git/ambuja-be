import { SessionLog } from "../models/SessionLog.js";
import { Employee } from "../models/Employee.js";
import { CallLog } from "../models/CallLog.js";
import { EmailLog } from "../models/EmailLog.js";

// Helper to format IP address and user agent
const getClientMeta = (req) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || req.ip || "Localhost";
  const userAgent = req.headers["user-agent"] || "Web Browser";
  return { ip, userAgent };
};

// POST /api/sessions/login
export const recordLogin = async (req, res) => {
  try {
    const { employeeId, employeeEmail, employeeName, role } = req.body;
    if (!employeeEmail) {
      return res.status(400).json({ success: false, message: "Employee email is required" });
    }

    const { ip, userAgent } = getClientMeta(req);

    // Auto-logout any active session for this user from before
    await SessionLog.updateMany(
      { employeeEmail: employeeEmail.toLowerCase(), status: { $in: ["Active", "Idle"] } },
      { $set: { status: "Logged Out", logoutTime: new Date() } }
    );

    const session = new SessionLog({
      employeeId: employeeId || "emp-admin",
      employeeEmail: employeeEmail.toLowerCase(),
      employeeName: employeeName || "Team Member",
      role: role || "employee",
      loginTime: new Date(),
      lastActiveTime: new Date(),
      status: "Active",
      ipAddress: ip,
      userAgent: userAgent,
    });

    const saved = await session.save();

    res.status(201).json({
      success: true,
      message: "Login session initiated",
      data: saved,
    });
  } catch (error) {
    console.error("Error recording login session:", error);
    res.status(500).json({ success: false, message: "Failed to record login", error: error.message });
  }
};

// POST /api/sessions/heartbeat
export const sendHeartbeat = async (req, res) => {
  try {
    const { sessionId, isActive, activeDeltaSeconds = 30 } = req.body;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: "sessionId is required" });
    }

    const session = await SessionLog.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const now = new Date();
    session.lastActiveTime = now;
    session.status = isActive ? "Active" : "Idle";

    if (isActive) {
      session.activeScreenSeconds += Number(activeDeltaSeconds) || 30;
    } else {
      session.idleSeconds += Number(activeDeltaSeconds) || 30;
    }

    // Calculate duration
    session.durationSeconds = Math.max(0, Math.floor((now.getTime() - new Date(session.loginTime).getTime()) / 1000));

    await session.save();

    res.json({
      success: true,
      message: "Heartbeat acknowledged",
      data: {
        sessionId: session.sessionId,
        status: session.status,
        activeScreenSeconds: session.activeScreenSeconds,
        durationSeconds: session.durationSeconds,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Heartbeat failed", error: error.message });
  }
};

// POST /api/sessions/logout
export const recordLogout = async (req, res) => {
  try {
    const { sessionId, employeeEmail } = req.body;

    let query = {};
    if (sessionId) {
      query = { sessionId };
    } else if (employeeEmail) {
      query = { employeeEmail: employeeEmail.toLowerCase(), status: { $in: ["Active", "Idle"] } };
    } else {
      return res.status(400).json({ success: false, message: "Provide sessionId or employeeEmail" });
    }

    const now = new Date();
    const sessions = await SessionLog.find(query);

    for (const session of sessions) {
      session.logoutTime = now;
      session.status = "Logged Out";
      session.durationSeconds = Math.max(0, Math.floor((now.getTime() - new Date(session.loginTime).getTime()) / 1000));
      await session.save();
    }

    res.json({
      success: true,
      message: "Logout session recorded successfully",
      count: sessions.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to record logout", error: error.message });
  }
};

// GET /api/sessions/monitoring
// Centralized Manager Dashboard query for tracking all employee time & activity
export const getCentralizedMonitoring = async (req, res) => {
  try {
    const selectedDateStr = req.query.date || new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const dateStart = new Date(selectedDateStr + "T00:00:00.000Z");
    const dateEnd = new Date(selectedDateStr + "T23:59:59.999Z");

    // Fetch registered employees from MongoDB
    const employees = await Employee.find().sort({ name: 1 });

    // Fetch sessions for the target date
    const daySessions = await SessionLog.find({
      loginTime: { $gte: dateStart, $lte: dateEnd },
    }).sort({ loginTime: -1 });

    // Fetch call logs & email logs for activity metrics
    const [callLogs, emailLogs] = await Promise.all([
      CallLog.find({ timestamp: { $gte: dateStart.toISOString(), $lte: dateEnd.toISOString() } }),
      EmailLog.find({ sentAt: { $gte: dateStart.toISOString(), $lte: dateEnd.toISOString() } }),
    ]);

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    // Map metrics per employee
    const monitoringData = employees.map((emp) => {
      const empEmail = emp.email.toLowerCase();
      const empSessions = daySessions.filter((s) => s.employeeEmail === empEmail);

      const latestSession = empSessions[0] || null;

      // Determine real-time online status
      let liveStatus = "Offline";
      if (latestSession) {
        if (latestSession.status === "Active" && new Date(latestSession.lastActiveTime) > tenMinutesAgo) {
          liveStatus = "Online";
        } else if (latestSession.status === "Idle" && new Date(latestSession.lastActiveTime) > tenMinutesAgo) {
          liveStatus = "Idle";
        }
      }

      // Calculate total work duration & active screen time for today
      let totalWorkSec = 0;
      let totalActiveScreenSec = 0;
      let firstLogin = null;
      let lastLogout = null;

      if (empSessions.length > 0) {
        // Chronological order for first login / last logout
        const sortedAsc = [...empSessions].sort((a, b) => new Date(a.loginTime) - new Date(b.loginTime));
        firstLogin = sortedAsc[0].loginTime;
        lastLogout = sortedAsc[sortedAsc.length - 1].logoutTime || sortedAsc[sortedAsc.length - 1].lastActiveTime;

        empSessions.forEach((s) => {
          const end = s.logoutTime || s.lastActiveTime || new Date();
          const dur = Math.max(0, Math.floor((new Date(end).getTime() - new Date(s.loginTime).getTime()) / 1000));
          totalWorkSec += dur;
          totalActiveScreenSec += s.activeScreenSeconds || 0;
        });
      }

      // Activity metrics
      const callsDone = callLogs.filter((c) => c.employeeId === emp.id || c.employeeId === emp._id.toString() || (c.employeeName && c.employeeName.toLowerCase().includes(emp.name.toLowerCase()))).length;
      const emailsSent = emailLogs.filter((m) => m.employeeId === emp.id || m.employeeId === emp._id.toString() || (m.employeeName && m.employeeName.toLowerCase().includes(emp.name.toLowerCase()))).length;

      const productivityRatio = totalWorkSec > 0 ? Math.min(100, Math.round((totalActiveScreenSec / totalWorkSec) * 100)) : 0;

      return {
        id: emp.id || emp._id.toString(),
        name: emp.name,
        email: emp.email,
        role: emp.role,
        department: emp.department,
        designation: emp.designation,
        avatar: emp.avatar || "💼",
        liveStatus,
        firstLoginTime: firstLogin,
        lastLogoutTime: lastLogout,
        totalWorkingSeconds: totalWorkSec,
        activeScreenSeconds: totalActiveScreenSec,
        productivityRatio,
        callsDone,
        emailsSent,
        dailyCallTarget: emp.dailyCallTarget || 30,
        dailyEmailTarget: emp.dailyEmailTarget || 20,
        sessionsCount: empSessions.length,
        sessions: empSessions,
      };
    });

    // Overview KPIs
    const onlineCount = monitoringData.filter((d) => d.liveStatus === "Online").length;
    const idleCount = monitoringData.filter((d) => d.liveStatus === "Idle").length;
    const offlineCount = monitoringData.filter((d) => d.liveStatus === "Offline").length;

    res.json({
      success: true,
      date: selectedDateStr,
      summary: {
        totalEmployees: employees.length,
        onlineNow: onlineCount,
        idleNow: idleCount,
        offlineNow: offlineCount,
      },
      data: monitoringData,
    });
  } catch (error) {
    console.error("Error fetching monitoring data:", error);
    res.status(500).json({ success: false, message: "Failed to fetch monitoring data", error: error.message });
  }
};

// GET /api/sessions/employee/:id
export const getEmployeeSessionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const sessions = await SessionLog.find({
      $or: [{ employeeId: id }, { employeeEmail: id.toLowerCase() }],
    }).sort({ loginTime: -1 }).limit(50);

    res.json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch employee sessions", error: error.message });
  }
};
