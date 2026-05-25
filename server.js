require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors()); // simple & safe
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
transporter.verify((err) => {
  if (err) {
    console.log("❌ SMTP ERROR:", err);
  } else {
    console.log("✅ SMTP READY");
  }
});

/* =========================
   TEST MAIL (DEBUG)
========================= */
app.get("/test-mail", async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      text: "Test mail working hai 👍",
    });

    console.log("📩 TEST MAIL SENT:", info.response);

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

    console.log("📩 REQUEST RECEIVED:", req.body);

    const info = await transporter.sendMail({
      from: `"Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    console.log("📩 EMAIL SENT:", info.response);

    return res.json({
      success: true,
      message: "Message sent successfully ✅",
    });

  } catch (error) {
    console.log("❌ EMAIL ERROR:", error);

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