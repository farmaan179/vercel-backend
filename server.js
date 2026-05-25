require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors({
  origin: "https://my-resume-tau-seven.vercel.app",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

/* =========================
   ENV DEBUG (NEW 🔥)
========================= */
console.log("📌 EMAIL_USER:", process.env.EMAIL_USER);
console.log("📌 EMAIL_PASS EXISTS:", !!process.env.EMAIL_PASS);

/* =========================
   HOME ROUTE
========================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Working ✅",
  });
});

/* =========================
   NODEMAILER SETUP
========================= */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* SMTP CHECK (IMPROVED 🔥) */
transporter.verify((err, success) => {
  if (err) {
    console.log("❌ SMTP ERROR:", err);
  } else {
    console.log("✅ SMTP READY");
  }
});

/* =========================
   TEST MAIL ROUTE
========================= */
app.get("/test-mail", async (req, res) => {
  try {
    console.log("📩 TEST MAIL STARTING...");

    const info = await transporter.sendMail({
      from: `"Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      text: "Hello bhai test mail working hai",
    });

    console.log("📩 TEST EMAIL SENT:", info.response);

    res.json({
      success: true,
      message: "Test mail sent",
    });

  } catch (err) {
    console.log("❌ TEST MAIL ERROR FULL:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/* =========================
   CONTACT ROUTE (DEBUG IMPROVED)
========================= */
app.post("/api/contact", async (req, res) => {
  try {
    console.log("📩 REQUEST BODY:", req.body);

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      console.log("❌ MISSING FIELDS");
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    console.log("📩 SENDING EMAIL...");

    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    console.log("📩 EMAIL SENT SUCCESS:", info.response);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully ✅",
    });

  } catch (error) {
    console.log("❌ EMAIL ERROR FULL STACK:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 SERVER RUNNING ON ${PORT}`);
});