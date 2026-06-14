const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await resend.emails.send({
      from: "InterviewPrep AI <onboarding@resend.dev>",
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

          <p>We're excited to help you grow your career.</p>

          <p>Team InterviewPrep AI</p>
        </div>
      `,
    });

    return response;
  } catch (error) {
    console.error("Welcome Email Error:", error);
  }
};

const notifyAdmin = async (email, name) => {
  try {
    const response = await resend.emails.send({
      from: "InterviewPrep AI <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      subject: "🆕 New User Registration",
      html: `
        <h2>New User Registered</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    return response;
  } catch (error) {
    console.error("Admin Notification Error:", error);
  }
};

const sendLoginEmail = async (email, name) => {
  try {
    await resend.emails.send({
      from: "InterviewPrep AI <onboarding@resend.dev>",
      to: email,
      subject: "👋 Welcome Back",
      html: `
        <h2>Hello ${name}</h2>

        <p>You have successfully logged in.</p>

        <p>Enjoy your learning journey!</p>
      `,
    });
  } catch (error) {
    console.error("Login Email Error:", error);
  }
};

module.exports = {
  sendWelcomeEmail,
  notifyAdmin,
  sendLoginEmail
};