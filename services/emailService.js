import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable SMTP transporter
export const createTransporter = () => {
  const user = process.env.SMTP_USER || 'skywebdevelopers123@gmail.com';
  // Remove spaces if app password contains them
  const rawPass = process.env.SMTP_PASS || 'xgkogdvjvmpqfzhd';
  const pass = rawPass.replace(/\s+/g, '');

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'false' ? false : true, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Send 2FA One-Time Passcode (OTP) Email for Admin / Employee Login
 */
export const sendOtpEmail = async ({ email, otp, name, role = 'admin' }) => {
  try {
    const transporter = createTransporter();
    const sender = process.env.SMTP_USER || 'skywebdevelopers123@gmail.com';
    const notifyAdmin = process.env.ADMIN_NOTIFY_EMAIL || 'jpmaytrigroup@gmail.com';

    const isAdmin = role === 'admin' || email.includes('admin') || email.includes('jp@');
    const subject = isAdmin
      ? `🔐 Super Admin Login OTP: ${otp} — Ambhuja Maytri CRM`
      : `🔐 Employee Portal Verification OTP: ${otp} — Ambhuja Maytri`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #0c1524; color: #e2e8f0; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 24px; text-align: center; border-bottom: 2px solid ${isAdmin ? '#3b82f6' : '#14b8a6'};">
          <h1 style="color: ${isAdmin ? '#60a5fa' : '#2dd4bf'}; margin: 0 0 6px; font-size: 22px; letter-spacing: 0.5px;">MAYTRI AMBHUJA CRM</h1>
          <p style="color: #94a3b8; margin: 0; font-size: 13px;">${isAdmin ? '👑 Super Admin Security Verification' : '💼 Employee Secure Portal Login'}</p>
        </div>
        
        <div style="padding: 28px 24px; text-align: center;">
          <p style="font-size: 15px; color: #cbd5e1; margin-bottom: 12px;">Hello <strong>${name || (isAdmin ? 'Admin' : 'Team Member')}</strong>,</p>
          <p style="font-size: 14px; color: #94a3b8; margin-bottom: 24px;">Use the following one-time verification passcode (OTP) to sign in to the ${isAdmin ? 'Admin Management Dashboard' : 'Employee Workspace'}:</p>

          <div style="background: rgba(30, 41, 59, 0.8); border: 2px dashed ${isAdmin ? '#3b82f6' : '#14b8a6'}; border-radius: 10px; padding: 18px; margin: 0 auto 24px; max-width: 280px;">
            <span style="font-family: monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: ${isAdmin ? '#38bdf8' : '#2dd4bf'};">${otp}</span>
          </div>

          <p style="font-size: 12.5px; color: #facc15; margin-bottom: 8px;">⏱️ This code is valid for <strong>10 minutes</strong>.</p>
          <p style="font-size: 12px; color: #64748b; margin: 0;">If you did not initiate this login request, please ignore this email or contact support.</p>
        </div>

        <div style="background: #080d1a; padding: 14px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b;">
          Sent securely via SMTP to <strong>${email}</strong> &bull; ${isAdmin ? 'Super Admin Security Gateway' : 'Employee Authentication Desk'}
        </div>
      </div>
    `;

    // Send to recipient (and also CC backup monitor if different)
    const toRecipients = [email];
    if (notifyAdmin && notifyAdmin.toLowerCase() !== email.toLowerCase()) {
      toRecipients.push(notifyAdmin);
    }

    const info = await transporter.sendMail({
      from: `"Maytri Ambhuja Security" <${sender}>`,
      to: toRecipients.join(', '),
      subject,
      html: htmlContent,
    });

    console.log(`📧 OTP Email successfully sent to ${toRecipients.join(', ')} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Login Notification Email to Super Admin
 */
export const sendLoginNotification = async ({ user, ip, userAgent }) => {
  try {
    const transporter = createTransporter();
    const recipient = process.env.ADMIN_NOTIFY_EMAIL || 'jpmaytrigroup@gmail.com';
    const sender = process.env.SMTP_USER || 'skywebdevelopers123@gmail.com';
    
    const loginTime = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const isSuperAdmin = user.role === 'admin' || (user.designation && user.designation.toLowerCase().includes('admin'));
    const subject = isSuperAdmin
      ? `👑 Super Admin Login Alert: ${user.name} (${user.email})`
      : `🔐 CRM Login Notification: ${user.name} (${user.email})`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0c1524; color: #e2e8f0; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 24px; text-align: center; border-bottom: 2px solid #3b82f6;">
          <h1 style="color: #60a5fa; margin: 0 0 6px; font-size: 22px; letter-spacing: 0.5px;">MAYTRI GROUP CRM</h1>
          <p style="color: #94a3b8; margin: 0; font-size: 14px;">Real Estate Management Portal</p>
        </div>
        
        <div style="padding: 24px;">
          <div style="background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; padding: 14px 16px; border-radius: 6px; margin-bottom: 20px;">
            <h2 style="color: #93c5fd; margin: 0 0 4px; font-size: 16px;">
              ${isSuperAdmin ? '👑 Super Admin Login Detected' : '👤 User Login Detected'}
            </h2>
            <p style="margin: 0; font-size: 13px; color: #cbd5e1;">A user has successfully signed in to the Maytri Lead & CMS Admin Portal.</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 10px 0; color: #94a3b8; width: 140px;"><strong>User Name:</strong></td>
              <td style="padding: 10px 0; color: #ffffff;">${user.name || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 10px 0; color: #94a3b8;"><strong>Email Address:</strong></td>
              <td style="padding: 10px 0; color: #38bdf8;"><strong>${user.email}</strong></td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 10px 0; color: #94a3b8;"><strong>Role / Designation:</strong></td>
              <td style="padding: 10px 0; color: #facc15;">${(user.role || 'staff').toUpperCase()} — ${user.designation || 'Staff'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 10px 0; color: #94a3b8;"><strong>Department:</strong></td>
              <td style="padding: 10px 0; color: #cbd5e1;">${user.department || 'General'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 10px 0; color: #94a3b8;"><strong>Login Time (IST):</strong></td>
              <td style="padding: 10px 0; color: #34d399;">${loginTime}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 10px 0; color: #94a3b8;"><strong>IP Address:</strong></td>
              <td style="padding: 10px 0; color: #cbd5e1; font-family: monospace;">${ip || 'Unknown / Localhost'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #94a3b8;"><strong>Client / Browser:</strong></td>
              <td style="padding: 10px 0; color: #94a3b8; font-size: 12px; font-family: monospace; word-break: break-word;">${userAgent || 'Web Browser'}</td>
            </tr>
          </table>

          <div style="text-align: center; margin: 24px 0 10px;">
            <a href="http://localhost:5174" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 13px; display: inline-block;">
              Open Admin Portal &rarr;
            </a>
          </div>
        </div>

        <div style="background: #080d1a; padding: 14px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b;">
          This is an automated security & audit notification sent from Maytri Ambhuja Real Estate Server.<br/>
          Recipient: <strong>${recipient}</strong>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Maytri CRM Security" <${sender}>`,
      to: recipient,
      subject,
      html: htmlContent,
    });

    console.log(`📧 Login notification email sent successfully to ${recipient} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send login notification email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send New Lead Notification Email to Admin
 */
export const sendLeadNotification = async (lead) => {
  try {
    const transporter = createTransporter();
    const recipient = process.env.ADMIN_NOTIFY_EMAIL || 'jpmaytrigroup@gmail.com';
    const sender = process.env.SMTP_USER || 'skywebdevelopers123@gmail.com';

    const time = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const subject = `🎯 New Lead Received: ${lead.fullName} (${lead.phone})`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: #0f172a; padding: 18px; color: #ffffff; text-align: center;">
          <h2 style="margin: 0; font-size: 18px; color: #38bdf8;">NEW LEAD ENQUIRY — MAYTRI AMBHUJA</h2>
        </div>
        <div style="padding: 20px; color: #334155; font-size: 14px;">
          <p>A new enquiry has been submitted on the Maytri Ambhuja website.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Name:</strong></td><td style="padding: 8px 0; font-weight: bold;">${lead.fullName}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td><td style="padding: 8px 0; color: #0284c7; font-weight: bold;"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 8px 0;">${lead.email || 'Not Provided'}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Interest:</strong></td><td style="padding: 8px 0;">${lead.unitInterest || 'Villa Enquiry'}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Budget:</strong></td><td style="padding: 8px 0;">${lead.budget || '₹3.8 Cr - ₹5.5 Cr'}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Source:</strong></td><td style="padding: 8px 0;">${lead.source || 'Website'}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Message:</strong></td><td style="padding: 8px 0;">${lead.message || 'None'}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;"><strong>Time:</strong></td><td style="padding: 8px 0;">${time}</td></tr>
          </table>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Maytri Leads" <${sender}>`,
      to: recipient,
      subject,
      html: htmlContent,
    });

    console.log(`📧 New lead notification email sent to ${recipient} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Lead notification email failed:', error.message);
    return { success: false, error: error.message };
  }
};
