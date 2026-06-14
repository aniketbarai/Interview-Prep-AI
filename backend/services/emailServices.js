const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendWelcomeEmail = async (email, name) => {
  try {
    const info = await transporter.sendMail({
      from: `"InterviewPrep AI" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: "Welcome to InterviewPrep AI 🚀",
      html: `
        <h1>Welcome ${name}</h1>
        <p>Your account has been created successfully.</p>
      `,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
};