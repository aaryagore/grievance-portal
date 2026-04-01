require('dotenv').config({ path: '../.env' });
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Incoming Request Logger
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path} at ${new Date().toISOString()}`);
  next();
});

// ══════════════════════════════════════════════════════════════
// ZCOER Intelligent Grievance Portal - Mail Backend (Port 5001)
// ══════════════════════════════════════════════════════════════
// 
// SETUP INSTRUCTIONS:
// 1. Replace the credentials below with your Gmail details
// 2. Enable 2-Step Verification on your Gmail account
// 3. Generate an "App Password" from: 
//    Google Account → Security → 2-Step Verification → App Passwords
// 4. Use THAT App Password below (not your regular Gmail password)
//    Run: node server.js
// ══════════════════════════════════════════════════════════════

// STARTUP AUTH CHECK (FOR RENDER TROUBLESHOOTING)
console.log(`[AUTH] ENVIRONMENT CHECK:`);
console.log(`[AUTH] GMAIL_USER: ${process.env.GMAIL_USER ? 'PRESENT (ok)' : 'MISSING (will fallback)'}`);
console.log(`[AUTH] GMAIL_PASS: ${process.env.GMAIL_PASS ? 'PRESENT (ok)' : 'MISSING (will fallback)'}`);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "zealcollegeit@gmail.com", // Use Environment Variable
    pass: process.env.GMAIL_PASS || "wtye psji kjtg osbi"   // Use Environment Variable
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Health check endpoints
app.get("/", (req, res) => {
  res.send("ZCOER Intelligent Grievance Portal - Mail Backend is active.");
});

app.get("/health", (req, res) => {
  res.json({ status: "ZCOER Mail Backend Running", port: 8088 });
});

// Send mail endpoint
app.post("/send-mail", async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields: to, subject, message" });
  }

  try {
    const info = await transporter.sendMail({
      from: `"ZCOER Grievance Cell" <${process.env.GMAIL_USER || "zealcollegeit@gmail.com"}>`,
      to: to,
      subject: subject,
      text: message,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
          <div style="background: #064F93; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <h2 style="color: #FFD700; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">ZCOER</h2>
            <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Intelligent Grievance Portal</p>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0; border-top: none;">
            <pre style="font-family: 'Inter', Arial, sans-serif; font-size: 14px; line-height: 1.7; color: #334155; white-space: pre-wrap; word-wrap: break-word;">${message}</pre>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
            <div style="text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">Zeal College of Engineering and Research | S.No. 39, Narhe, Pune-411041</p>
              <p style="font-size: 11px; color: #94a3b8; margin: 4px 0 0;">This is an automated message. Please do not reply.</p>
            </div>
          </div>
        </div>
      `
    });

    console.log(`[MAIL SENT] To: ${to} | Subject: ${subject} | MessageId: ${info.messageId}`);
    res.json({ success: true, messageId: info.messageId, to });
  } catch (error) {
    console.error(`[MAIL ERROR] FULL DIAGNOSTIC:`, {
      code: error.code,
      command: error.command,
      response: error.response,
      message: error.message
    });
    res.status(500).json({ 
      error: "Mail delivery failed", 
      details: error.message,
      code: error.code 
    });
  }
});

const PORT = process.env.PORT || 8088;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n╔══════════════════════════════════════════════════╗`);
    console.log(`║   ZCOER Intelligent Grievance - Mail Backend     ║`);
    console.log(`║   Running on http://localhost:${PORT}               ║`);
    console.log(`╚══════════════════════════════════════════════════╝\n`);
    console.log(`⚠️  IMPORTANT: Configure your Gmail credentials in this file.`);
    console.log(`   Then restart. See comments at top of file for instructions.\n`);
  });
}

module.exports = app;
