const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("🔥 REQUEST:", req.method, req.url);
  next();
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "farmaanmewati743@gmail.com",
    pass: "oxqqanvqlyyqqnkw" // 
  }
});

// transporter check
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ TRANSPORT ERROR:", error);
  } else {
    console.log("✅ Email server ready");
  }
});

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

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
      from: "farmaanmewati743@gmail.com",
      replyTo: email,
      to: "farmaanmewati743@gmail.com",
      subject: `Portfolio Contact from ${name}`,
      html: `
        <h2>New Message 🚀</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    console.log("✅ MAIL SENT:", info.response);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully 🚀"
    });

  } catch (error) {
    console.log("❌ EMAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Email failed"
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});