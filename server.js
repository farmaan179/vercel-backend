require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log("🔥 REQUEST:", req.method, req.url);
  next();
});

// Email transporter (ENV based)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Check email connection
transporter.verify((error) => {
  if (error) {
    console.log("❌ EMAIL SERVER ERROR:", error);
  } else {
    console.log("✅ Email server ready");
  }
});

// Home route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Contact API
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  console.log("📩 DATA RECEIVED:", { name, email, message });

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields required"
    });
  }

  try {
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

    console.log("✅ MAIL SENT:", info.response);

    res.status(200).json({
      success: true,
      message: "Message sent successfully 🚀"
    });

  } catch (error) {
    console.log("❌ EMAIL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Email failed"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});