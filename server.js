require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

/* ✅ FIX CORS */
app.use(cors({
  origin: "*"
}));

app.use(express.json());

/* HOME */
app.get("/", (req, res) => {
  res.send("Backend Working ✅");
});

/* EMAIL SETUP */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* TEST */
app.get("/test-mail", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test",
      text: "Working",
    });

    res.send("Mail Sent ✅");

  } catch (err) {
    console.log(err);
    res.send("Mail Failed ❌");
  }
});

/* CONTACT */
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.send({ success: false, message: "Missing fields" });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: "New Message",
      text: `${name} ${email} ${message}`,
    });

    res.send({ success: true });

  } catch (err) {
    console.log(err);
    res.send({ success: false });
  }
});

/* SERVER START */
app.listen(5000, () => {
  console.log("Server Running");
});