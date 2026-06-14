const nodemailer = require("nodemailer");

console.log("EMAIL CONFIG:", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  userExists: !!process.env.SMTP_USER,
  passExists: !!process.env.SMTP_PASS,
  adminEmail: process.env.ADMIN_EMAIL,
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendWelcomeEmail = async (email, name) => {
  try {
    console.log("Attempting welcome email to:", email);
    const info = await transporter.sendMail({
      from: `"InterviewPrep AI" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: "🎉 Welcome to InterviewPrep AI",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1>Welcome ${name}! 🚀</h1>

          <p>Your account has been successfully created.</p>

          <p>You can now:</p>

          <ul>
            <li>Practice AI Interviews</li>
            <li>Review Resumes</li>
            <li>Get Career Guidance</li>
            <li>Prepare for HR Interviews</li>
          </ul>

          <p>Happy Learning!</p>

          <p><strong>InterviewPrep AI Team</strong></p>
        </div>
      `,
    });

   console.log("Email sent:", info.messageId);
    console.log("Brevo response:", info.response);

    return info;
  } catch (error) {
    console.error("Welcome email error:", error);
    throw error;
  }
};

const notifyAdmin = async (email, name) => {
  try {
    const info = await transporter.sendMail({
      from: `"InterviewPrep AI" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "🆕 New User Registration",
      html: `
        <h2>New User Registered</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    console.log("Admin email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Admin email error:", error);
    throw error;
  }
};

module.exports = {
  transporter,
  sendWelcomeEmail,
  notifyAdmin,
};