require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const validator = require("validator");

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   CORS MIDDLEWARE
========================= */
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://my-resume-tau-seven.vercel.app"
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

/* =========================
   BODY PARSER
========================= */
app.use(express.json());

/* =========================
   DEBUG LOG
========================= */
app.use((req, res, next) => {
  console.log("Incoming Origin:", req.headers.origin);
  next();
});

/* =========================
   HEALTH CHECK ROUTE
========================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend running 🚀"
  });
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

/* =========================
   VERIFY SMTP
========================= */
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

    /* VALIDATION */
    if (
      !name?.trim() ||
      !email?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    /* EMAIL VALIDATION */
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address"
      });
    }

    /* SEND EMAIL */
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Message from ${name}`,

      html: `
        <h2>New Contact Message</h2>

        <p>
          <strong>Name:</strong> ${validator.escape(name)}
        </p>

        <p>
          <strong>Email:</strong> ${validator.escape(email)}
        </p>

        <p>
          <strong>Message:</strong>
        </p>

        <p>
          ${validator.escape(message).replace(/\n/g, "<br>")}
        </p>
      `
    });

    return res.status(200).json({
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
  console.log(`🚀 Server running on port ${PORT}`);
});