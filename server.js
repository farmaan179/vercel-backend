require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   HOME ROUTE
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Working ✅",
  });
});

/* =========================
   NODEMAILER SAFE SETUP
========================= */

let transporter;

try {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log("SMTP CONFIG LOADED ✅");

} catch (err) {
  console.log("SMTP SETUP ERROR ❌", err);
}

/* =========================
   CONTACT ROUTE
========================= */

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log("REQUEST BODY:", req.body);

    if (!transporter) {
      return res.status(500).json({
        success: false,
        message: "Email system not configured",
      });
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    console.log("EMAIL SENT ✅", info.response);

    return res.status(200).json({
      success: true,
      message: "Email Sent ✅",
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