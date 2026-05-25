require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

/* =========================
   PORT (ENV CONTROLLED)
========================= */
const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors({
  origin: "*"
}));

app.use(express.json());

/* =========================
   HOME ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend Working ✅");
});

/* =========================
   EMAIL SETUP (GMAIL SMTP)
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================
   TEST MAIL ROUTE
========================= */
app.get("/test-mail", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Mail",
      text: "Backend working fine 👍",
    });

    res.send("Mail Sent ✅");

  } catch (err) {
    console.log("TEST MAIL ERROR:", err);
    res.status(500).send("Mail Failed ❌");
  }
});

/* =========================
   CONTACT API ROUTE
========================= */
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log("REQUEST RECEIVED:", req.body);

    if (!name || !email || !message) {
      return res.status(400).send({
        success: false,
        message: "All fields required",
      });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Message from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
    });

    console.log("EMAIL SENT SUCCESSFULLY");

    res.send({
      success: true,
      message: "Message sent successfully ✅",
    });

  } catch (err) {
    console.log("EMAIL ERROR:", err);

    res.status(500).send({
      success: false,
      message: "Email sending failed ❌",
    });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});