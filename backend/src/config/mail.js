import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // your 16-character App Password
  },
});

// Proactively verify SMTP configuration on startup (logs only)
try {
  const required = ["EMAIL_USER", "EMAIL_PASS"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.warn("Missing SMTP env vars:", missing.join(", "));
  }

  // Only attempt verify if both present
  if (!missing.length) {
    transporter
      .verify()
      .then(() => {
        console.log("SMTP transporter verified and ready to send mail");
      })
      .catch((err) => {
        console.error("SMTP transporter verify failed:", err);
      });
  }
} catch (e) {
  console.error("SMTP verification bootstrap error:", e);
}
