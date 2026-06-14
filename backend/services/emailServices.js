const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const api = new SibApiV3Sdk.TransactionalEmailsApi();

const sendWelcomeEmail = async (email, name) => {
  try {
    const res = await api.sendTransacEmail({
      sender: {
        email: process.env.ADMIN_EMAIL,
        name: "InterviewPrep AI",
      },
      to: [{ email }],
      subject: "Welcome to InterviewPrep AI 🚀",
      htmlContent: `
        <h1>Welcome ${name}</h1>
        <p>Your account has been created successfully.</p>
      `,
    });

    console.log("Email sent:", res.messageId);
    return res;
  } catch (err) {
    console.error("Brevo email error:", err?.response?.body || err.message);
    throw err;
  }
};

module.exports = {
  sendWelcomeEmail,
};