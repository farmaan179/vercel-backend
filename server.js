require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log("🔥", req.method, req.url);
  next();
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

/* =========================
   ENV CHECK
========================= */
console.log("🔐 EMAIL_USER:", process.env.EMAIL_USER);
console.log("🔐 EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

/* =========================
   TRANSPORTER
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* IMPORTANT: VERIFY SMTP */
transporter.verify((err, success) => {
  if (err) {
    console.log("❌ SMTP NOT READY:", err);
  } else {
    console.log("✅ SMTP READY");
  }
});

/* =========================
   CONTACT API
========================= */
app.post("/api/contact", async (req, res) => {
  console.log("📩 CONTACT API HIT");

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields required"
    });
  }

  try {
    console.log("📤 Sending email...");

    const info = await transporter.sendMail({
      from: `"Portfolio" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact from ${name}`,
      html: `
        <h2>New Message 🚀</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br>${message}</p>
      `
    });

    console.log("✅ EMAIL SENT:", info.response);

    return res.json({
      success: true,
      message: "Message sent successfully 🚀"
    });

  } catch (error) {
    console.log("❌ EMAIL ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Email failed",
      error: error.message
    });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});