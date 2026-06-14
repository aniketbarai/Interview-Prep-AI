const nodemailer = require("nodemailer");

// Production-ready transporter with robust timeouts + TLS handling.
// Uses Gmail SMTP only if selected; Render commonly blocks Gmail on 587/587 without strict settings.
function buildTransporter() {
  const provider = (process.env.EMAIL_PROVIDER || "gmail").toLowerCase();

  const timeoutMs = Number(process.env.EMAIL_TIMEOUT_MS || 30000);
  const connectionTimeoutMs = Number(process.env.EMAIL_CONNECTION_TIMEOUT_MS || 20000);

  // If using Gmail, ensure you use an App Password (not your normal password).
  if (provider === "gmail") {
    return nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_SMTP_PORT || 587),
      secure: process.env.EMAIL_SMTP_SECURE === "true", // usually false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.EMAIL_TLS_REJECT_UNAUTHORIZED !== "false",
      },
      connectionTimeout: connectionTimeoutMs,
      greetingTimeout: timeoutMs,
      socketTimeout: timeoutMs,
      debug: process.env.NODE_ENV !== "production" && process.env.EMAIL_DEBUG === "true",
    });
  }

  // Default: use generic SMTP (recommended for Render reliability)
  // Recommended provider: SendGrid / Mailgun / Resend SMTP gateway.
  // Env vars expected:
  // EMAIL_SMTP_HOST, EMAIL_SMTP_PORT, EMAIL_SMTP_USER, EMAIL_SMTP_PASS, EMAIL_SMTP_SECURE
  if (provider === "smtp") {
    return nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST,
      port: Number(process.env.EMAIL_SMTP_PORT || 587),
      secure: process.env.EMAIL_SMTP_SECURE === "true",
      auth: {
        user: process.env.EMAIL_SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.EMAIL_SMTP_PASS || process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.EMAIL_TLS_REJECT_UNAUTHORIZED !== "false",
      },
      connectionTimeout: connectionTimeoutMs,
      greetingTimeout: timeoutMs,
      socketTimeout: timeoutMs,
      debug: process.env.NODE_ENV !== "production" && process.env.EMAIL_DEBUG === "true",
    });
  }

  // Allow choosing SendGrid-style SMTP as a convenience.
  // (SendGrid SMTP host typically: smtp.sendgrid.net:587)
  if (provider === "sendgrid") {
    return nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST || "smtp.sendgrid.net",
      port: Number(process.env.EMAIL_SMTP_PORT || 587),
      secure: process.env.EMAIL_SMTP_SECURE === "true",
      auth: {
        user: process.env.EMAIL_SMTP_USER,
        pass: process.env.EMAIL_SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.EMAIL_TLS_REJECT_UNAUTHORIZED !== "false",
      },
      connectionTimeout: connectionTimeoutMs,
      greetingTimeout: timeoutMs,
      socketTimeout: timeoutMs,
      debug: process.env.NODE_ENV !== "production" && process.env.EMAIL_DEBUG === "true",
    });
  }

  // Fallback to Gmail
  return nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_SMTP_PORT || 587),
    secure: process.env.EMAIL_SMTP_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.EMAIL_TLS_REJECT_UNAUTHORIZED !== "false",
    },
    connectionTimeout: connectionTimeoutMs,
    greetingTimeout: timeoutMs,
    socketTimeout: timeoutMs,
  });
}

const transporter = buildTransporter();

// If env vars are missing, sending will fail quickly with a clearer error.
function assertEmailEnv() {
  if (!process.env.EMAIL_USER) throw new Error("EMAIL_USER is not configured");
  if (!process.env.EMAIL_PASS) throw new Error("EMAIL_PASS is not configured");
  if (!process.env.ADMIN_EMAIL) throw new Error("ADMIN_EMAIL is not configured");
}


async function verifyTransporter() {
  // Verify only once per cold start.
  if (transporter?.__verified) return;
  transporter.__verified = true;
  try {
    await transporter.verify();
  } catch (e) {
    // Let email functions throw with a useful error.
    transporter.__verifyError = e;
  }
}

async function sendMailSafe(mailOptions) {
  assertEmailEnv();
  await verifyTransporter();
  if (transporter.__verifyError) {
    const msg = transporter.__verifyError?.message || "SMTP transporter verification failed";
    throw new Error(msg);
  }

  return transporter.sendMail(mailOptions);
}


const sendWelcomeEmail = async (email, name) => {
  try {
    const info = await sendMailSafe({
      from: `"InterviewPrep AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to InterviewPrep AI",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1>Welcome ${name}! 🎉</h1>

          <p>Your account has been successfully created.</p>

          <p>You can now:</p>

          <ul>
            <li>Practice AI Interviews</li>
            <li>Review Resumes</li>
            <li>Get Career Advice</li>
            <li>Prepare for HR Interviews</li>
          </ul>

          <p>Happy Learning 🚀</p>

          <p>Team InterviewPrep AI</p>
        </div>
      `,
    });

    console.log("Welcome email sent:", info.messageId);
  } catch (error) {
    console.error("Welcome email error:", error?.message || error);
    throw error;
  }
};

const notifyAdmin = async (email, name) => {
  try {
    const info = await sendMailSafe({
      from: `"InterviewPrep AI" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "🆕 New User Registration",
      html: `
        <h2>New User Registered</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    console.log("Admin notification sent:", info.messageId);
  } catch (error) {
    console.error("Admin email error:", error);
  }
};

const sendLoginEmail = async (email, name) => {
  try {
    await sendMailSafe({
      from: `"InterviewPrep AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "👋 Welcome Back",
      html: `
        <h2>Hello ${name}</h2>

        <p>You have successfully logged in.</p>

        <p>Good luck with your interview preparation 🚀</p>
      `,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendWelcomeEmail,
  notifyAdmin,
  sendLoginEmail
};