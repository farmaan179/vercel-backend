require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

/* =========================
   CONFIG
========================= */
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));
app.use(express.json());

/* =========================
   LOGS
========================= */
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
   ENV CHECK (IMPORTANT)
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
  },
  tls: {
    rejectUnauthorized: false
  }
});

console.log("📧 Email system initialized");

/* =========================
   CONTACT API
========================= */
app.post("/api/contact", async (req, res) => {
  console.log("📩 CONTACT API HIT");

  const { name, email, message } = req.body;
  console.log("📦 BODY:", req.body);

  if (!name || !email || !message) {
    console.log("❌ Missing fields");
    return res.status(400).json({
      success: false,
      message: "All fields required"
    });
  }

  try {
    console.log("📤 Sending email...");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact from ${name}`,
      html: `
        <h2>New Message 🚀</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log("📨 INFO:", info.response);

    return res.json({
      success: true,
      message: "Message sent successfully 🚀"
    });

  } catch (error) {
    console.log("❌ EMAIL ERROR:");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Email failed"
    });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});