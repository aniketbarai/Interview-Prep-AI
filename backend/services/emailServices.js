const nodemailer = require("nodemailer");

// Production-ready transporter with robust timeouts + TLS handling.
// Fixes: clearer env validation, safer transporter verify (no permanent cached failure).

function getProvider() {
  return (process.env.EMAIL_PROVIDER || "gmail").toLowerCase();
}

function getTimeouts() {
  const timeoutMs = Number(process.env.EMAIL_TIMEOUT_MS || 30000);
  const connectionTimeoutMs = Number(process.env.EMAIL_CONNECTION_TIMEOUT_MS || 20000);
  return { timeoutMs, connectionTimeoutMs };
}

function assertEmailEnv() {
  const provider = getProvider();

  if (!process.env.EMAIL_USER) throw new Error("EMAIL_USER is not configured");
  if (!process.env.EMAIL_PASS) throw new Error("EMAIL_PASS is not configured");
  if (!process.env.ADMIN_EMAIL) throw new Error("ADMIN_EMAIL is not configured");

  // Provider-specific validation to fail fast with actionable messages.
  if (provider === "smtp") {
    if (!process.env.EMAIL_SMTP_HOST) throw new Error("EMAIL_SMTP_HOST is not configured (required for EMAIL_PROVIDER=smtp)");
    if (!process.env.EMAIL_SMTP_PORT) {
      // port has a default in transporter, but require host at least.
    }
  }

  if (provider === "sendgrid") {
    // Default host exists, but auth must be present.
    const user = process.env.EMAIL_SMTP_USER;
    const pass = process.env.EMAIL_SMTP_PASS;
    if (!user || !pass) {
      throw new Error("EMAIL_SMTP_USER and EMAIL_SMTP_PASS are required (EMAIL_PROVIDER=sendgrid)");
    }
  }
}

function buildTransporter() {
  const provider = getProvider();
  const { timeoutMs, connectionTimeoutMs } = getTimeouts();

  // If using Gmail or other STARTTLS SMTP ports (commonly 587), secure should usually be false.
  const portFromEnv = process.env.EMAIL_SMTP_PORT ? Number(process.env.EMAIL_SMTP_PORT) : undefined;
  const secureFromEnv = process.env.EMAIL_SMTP_SECURE === "true";

  const autoSecure = (() => {
    if (process.env.EMAIL_SMTP_SECURE !== undefined) return secureFromEnv;
    // Heuristic: 465 => secure; 587/25 => STARTTLS/plain.
    if (portFromEnv === 465) return true;
    return false;
  })();

  if (provider === "gmail") {
    return nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_SMTP_PORT || 587),
      secure: autoSecure,
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

  if (provider === "smtp") {
    return nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST,
      port: Number(process.env.EMAIL_SMTP_PORT || 587),
      secure: autoSecure,
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

  if (provider === "sendgrid") {
    return nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST || "smtp.sendgrid.net",
      port: Number(process.env.EMAIL_SMTP_PORT || 587),
      secure: autoSecure,
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

  // Fallback to Gmail.
  return nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_SMTP_PORT || 587),
    secure: autoSecure,
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

async function verifyTransporter({ force = false } = {}) {
  // Avoid permanent caching of verification failure.
  // Cache successful verification, but if it fails we allow future attempts.
  if (!force && transporter?.__verified) return;
  if (!force && transporter?.__verifyingPromise) return transporter.__verifyingPromise;

  transporter.__verifyingPromise = (async () => {
    try {
      await transporter.verify();
      transporter.__verified = true;
      transporter.__verifyError = null;
    } catch (e) {
      transporter.__verified = false;
      transporter.__verifyError = e;
      throw e;
    } finally {
      transporter.__verifyingPromise = null;
    }
  })();

  return transporter.__verifyingPromise;
}

function formatSmtpDebugError() {
  const provider = getProvider();
  const host = process.env.EMAIL_SMTP_HOST || (provider === "gmail" ? "smtp.gmail.com" : undefined);
  const port = process.env.EMAIL_SMTP_PORT || undefined;
  return { provider, host, port: port ? Number(port) : undefined };
}

async function sendMailSafe(mailOptions) {
  assertEmailEnv();

  try {
    // Verify only once after success.
    if (!transporter?.__verified) {
      await verifyTransporter();
    }
  } catch (e) {
    const dbg = formatSmtpDebugError();
    const errMsg = e?.message || "SMTP transporter verification failed";
    throw new Error(`${errMsg} | smtp_debug=${JSON.stringify(dbg)}`);
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