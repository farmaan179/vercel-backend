// server.js

const express = require("express");
const cors = require("cors");

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
   CONTACT ROUTE
========================= */

app.post("/api/contact", (req, res) => {

  console.log("BODY:", req.body);

  return res.status(200).json({
    success: true,
    message: "Message Sent ✅",
  });

});

/* =========================
   SERVER
========================= */

const PORT = 5000;

app.listen(PORT, () => {

  console.log(`🚀 SERVER RUNNING ON ${PORT}`);

});