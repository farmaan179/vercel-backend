app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: "ENV missing",
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    let info;

    try {
      info = await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.log("SMTP FAIL ❌", mailErr);

      return res.status(500).json({
        success: false,
        message: "Email sending failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email Sent ✅",
    });

  } catch (err) {
    console.log("SERVER CRASH ❌", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});