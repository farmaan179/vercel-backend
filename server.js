require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   CORS MIDDLEWARE (FIXED)
========================= */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith("http://localhost")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

/* =========================
   BODY PARSER
========================= */
app.use(express.json());

/* =========================
   DEBUG LOG (optional)
========================= */
app.use((req, res, next) => {
  console.log("Incoming Origin:", req.headers.origin);
  next();
});

/* =========================
   HEALTH CHECK ROUTE
========================= */
app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});

/* =========================
   NODEMAILER SETUP
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* VERIFY EMAIL SERVER */
transporter.verify((error) => {
  if (error) {
    console.log("❌ SMTP ERROR:", error.message);
  } else {
    console.log("✅ SMTP READY");
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
        message: "All fields are required"
      });
    }

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    return res.json({
      success: true,
      message: "Email sent successfully 🚀"
    });

  } catch (error) {
    console.log("❌ ERROR:", error.message);

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
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});