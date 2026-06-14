const SibApiV3Sdk = require("sib-api-v3-sdk");

// ========================
// BREVO CONFIG
// ========================
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const api = new SibApiV3Sdk.TransactionalEmailsApi();

// ========================
// COMMON EMAIL STYLES
// ========================
const baseTemplate = (content) => `
  <div style="font-family:Arial;background:#f4f6f8;padding:30px;">
    <div style="max-width:600px;margin:auto;background:white;padding:25px;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">

      <div style="text-align:center;margin-bottom:20px;">
        <h2 style="color:#4f46e5;">InterviewPrep AI 🚀</h2>
      </div>

      ${content}

      <hr style="margin:20px 0;" />

      <p style="font-size:12px;color:#888;text-align:center;">
        © ${new Date().getFullYear()} InterviewPrep AI. All rights reserved.
      </p>

    </div>
  </div>
`;

// ========================
// WELCOME EMAIL
// ========================
const sendWelcomeEmail = async (email, name) => {
  try {
    const html = baseTemplate(`
      <h2 style="color:#111;">Welcome, ${name} 👋</h2>

      <p style="color:#555;">
        Your account has been created successfully. You are now ready to start your
        <b>AI-powered interview preparation journey</b>.
      </p>

      <ul style="color:#444;">
        <li>🎯 AI Interview Practice</li>
        <li>📄 Resume Review</li>
        <li>🧠 Concept Learning</li>
        <li>💼 Career Guidance</li>
      </ul>

      <div style="text-align:center;margin-top:25px;">
        <a href="${process.env.FRONTEND_URL}"
           style="background:#4f46e5;color:white;padding:12px 20px;
           text-decoration:none;border-radius:6px;display:inline-block;">
          Start Practicing 🚀
        </a>
      </div>
    `);

    const res = await api.sendTransacEmail({
      sender: {
        email: process.env.ADMIN_EMAIL,
        name: "InterviewPrep AI",
      },
      to: [{ email }],
      subject: "Welcome to InterviewPrep AI 🚀",
      htmlContent: html,
    });

    console.log("Welcome email sent:", res.messageId);
    return res;
  } catch (err) {
    console.error("Welcome email error:", err?.response?.body || err.message);
    throw err;
  }
};

// ========================
// ADMIN NOTIFICATION EMAIL
// ========================
const notifyAdmin = async (email, name, type = "REGISTER") => {
  try {
    const html = baseTemplate(`
      <h2 style="color:#111;">Admin Alert ⚡</h2>

      <p style="color:#555;">
        A new user activity was detected in InterviewPrep AI system.
      </p>

      <div style="background:#f9fafb;padding:15px;border-radius:8px;">
        <p><b>Type:</b> ${type}</p>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Time:</b> ${new Date().toLocaleString()}</p>
      </div>

      <p style="margin-top:15px;color:#666;">
        You can monitor all users from your admin dashboard.
      </p>
    `);

    const res = await api.sendTransacEmail({
      sender: {
        email: process.env.ADMIN_EMAIL,
        name: "InterviewPrep AI System",
      },
      to: [{ email: process.env.ADMIN_EMAIL }],
      subject: `New User ${type} - InterviewPrep AI`,
      htmlContent: html,
    });

    console.log("Admin email sent:", res.messageId);
    return res;
  } catch (err) {
    console.error("Admin email error:", err?.response?.body || err.message);
    throw err;
  }
};

module.exports = {
  sendWelcomeEmail,
  notifyAdmin,
};