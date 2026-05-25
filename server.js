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
  res.json({
    success: true,
    message: "Backend Working ✅",
  });
});

/* =========================
   NODEMAILER SETUP
========================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* Optional check */
transporter.verify((err) => {
  if (err) {
    console.log("SMTP ERROR ❌", err);
  } else {
    console.log("SMTP READY ✅");
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

  // 🔥 FAST RESPONSE FIRST (fix "Sending...")
  res.status(200).json({
    success: true,
    message: "Message sent successfully ✅",
  });

  // 🔥 EMAIL BACKGROUND ME SEND HOGA
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `New Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  }).then(info => {
    console.log("EMAIL SENT ✅", info.response);
  }).catch(err => {
    console.log("EMAIL ERROR ❌", err);
  });
});
/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 SERVER RUNNING ON ${PORT}`);
});