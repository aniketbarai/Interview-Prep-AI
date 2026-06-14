const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (email, name) => {
  try {
    const info = await transporter.sendMail({
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
    console.error("Welcome email error:", error);
  }
};

const notifyAdmin = async (email, name) => {
  try {
    const info = await transporter.sendMail({
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
    await transporter.sendMail({
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