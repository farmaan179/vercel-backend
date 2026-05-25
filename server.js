require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
 

/* =========================
   MIDDLEWARE
========================= */

app.use(cors({
  origin: "*",
}));

app.use(express.json());

/* =========================
   HOME ROUTE
========================= */

app.get("/", (req, res) => {

  return res.status(200).json({
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
   CONTACT ROUTE
========================= */

app.post("/api/contact", async (req, res) => {

  try {

    const { name, email, message } = req.body;

    console.log(req.body);

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

    return res.status(200).json({
      success: true,
      message: "Email Sent ✅",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Email Failed ❌",
    });

  }

});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`🚀 SERVER RUNNING ON ${PORT}`);

});