require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

/* =========================
   MIDDLEWARE (FIXED CORS)
========================= */
app.use(cors({
  origin: "https://my-resume-tau-seven.vercel.app",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

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

/* SMTP CHECK */
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
    console.log("❌ TEST MAIL ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Test mail failed",
    });
  }
});

/* =========================
   CONTACT ROUTE (FIXED + SAFE)
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

    console.log("📩 Incoming request:", req.body);

    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Message from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
    });

    console.log("📩 EMAIL SENT SUCCESS:", info.response);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully ✅",
    });

  } catch (error) {
    console.log("❌ EMAIL ERROR FULL:", error);

    return res.status(500).json({
      success: false,
      message: "Email sending failed ❌",
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