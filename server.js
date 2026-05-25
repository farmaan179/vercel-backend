require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

/* =========================
   CORS (FIXED FOR VERCEL)
========================= */
app.use(cors({
  origin: "https://my-resume-tau-seven.vercel.app",
  methods: ["GET", "POST"],
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
   NODEMAILER
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================
   TEST MAIL
========================= */
app.get("/test-mail", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Mail",
      text: "Backend working fine 👍",
    });

    res.json({ success: true, message: "Test mail sent" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Mail failed" });
  }
});

/* =========================
   CONTACT API
========================= */
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log("REQUEST RECEIVED:", req.body);

    if (!name || !email || !message) {
      return res.json({
        success: false,
        message: "Missing fields"
      });
    }

    let info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    console.log("EMAIL SENT:", info.response);

    return res.json({
      success: true,
      message: "Message sent successfully"
    });

  } catch (error) {
    console.log("EMAIL ERROR:", error);

    return res.json({
      success: false,
      message: error.message
    });
  }
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});