require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Working ✅",
  });
});

/* =========================
   RESEND INIT (SAFE)
========================= */

let resend;

try {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log("RESEND READY ✅");
} catch (err) {
  console.log("RESEND INIT ERROR ❌", err);
}

/* =========================
   CONTACT API
========================= */

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!resend) {
      return res.status(500).json({
        success: false,
        message: "Email service not ready",
      });
    }

    const result = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: process.env.EMAIL_USER,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    console.log("EMAIL SENT ✅", result);

    return res.status(200).json({
      success: true,
      message: "Email Sent Successfully ✅",
    });

  } catch (error) {
    console.log("EMAIL ERROR ❌", error);

    return res.status(500).json({
      success: false,
      message: "Email Failed ❌",
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