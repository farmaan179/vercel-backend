require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
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
   TEST MAIL ROUTE (SEPARATE)
========================= */
app.get("/test-mail", async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      text: "Hello bhai test mail working hai",
    });

    console.log("TEST EMAIL:", info.response);

    res.json({ success: true });
  } catch (err) {
    console.log("TEST MAIL ERROR:", err);
    res.json({ success: false });
  }
});

/* =========================
   CONTACT ROUTE
========================= */
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields required",
    });
  }

  res.status(200).json({
    success: true,
    message: "Message sent successfully ✅",
  });

  transporter.sendMail(
    {
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    },
    (error, info) => {
      if (error) {
        console.log("❌ EMAIL ERROR:", error);
      } else {
        console.log("📩 EMAIL SENT:", info.response);
      }
    }
  );
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 SERVER RUNNING ON ${PORT}`);
});