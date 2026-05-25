require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors({
  origin: "*"
}));

app.use(express.json());

/* =========================
   RESEND SETUP
========================= */
const resend = new Resend(process.env.RESEND_API_KEY);

/* =========================
   HOME ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend Working with Resend 🚀");
});

/* =========================
   CONTACT API
========================= */
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const data = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: process.env.EMAIL_TO,
      subject: `New Message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    console.log("EMAIL SENT:", data);

    return res.json({
      success: true,
      message: "Message sent successfully 🚀",
    });

  } catch (error) {
    console.log("RESEND ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Email sending failed",
    });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});