require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Ensure required environment variables are loaded
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ EMAIL_USER or EMAIL_PASS is not set in .env file!");
  process.exit(1); // Stop the server if credentials are missing
}

console.log("✅ EMAIL_USER loaded:", process.env.EMAIL_USER);
console.log("✅ EMAIL_PASS loaded:", process.env.EMAIL_PASS ? "✔ Loaded" : "❌ Not Loaded");

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email sending route
app.post("/send-email", async (req, res) => {
  try {
    console.log("📩 Received email request with data:", req.body);

    const { customerName, email, phone, orderType, cartItems, totalAmount, transactionId, paymentMethod, receiptURL } = req.body;

    // Validation: Ensure required fields exist
    if (!customerName || !email || !phone || !orderType || !totalAmount || !transactionId || !paymentMethod) {
      console.error("❌ Missing required fields in request!");
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    // Build email content
    let emailContent = `
      <h2>🛒 Order Confirmation</h2>
      <p><strong>Transaction ID:</strong> ${transactionId}</p>
      <p><strong>Name:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Payment Method:</strong> ${paymentMethod}</p>
      <p><strong>Total Amount:</strong> ₱${totalAmount}</p>
    `;

    if (orderType === "shop") {
      if (!cartItems || cartItems.length === 0) {
        console.error("❌ cartItems is empty!");
        return res.status(400).json({ success: false, message: "Cart items are required for shop orders!" });
      }

      emailContent += `
        <p><strong>🛍 Order Type:</strong> Shop Purchase</p>
        <ul>
          ${cartItems.map((item) => `<li><strong>${item.name}</strong> (Size: ${item.size}) - ${item.quantity} pcs</li>`).join("")}
        </ul>
      `;

      if (paymentMethod === "GCash" && receiptURL) {
        emailContent += `<p><strong>🧾 Receipt:</strong> <a href="${receiptURL}">View Receipt</a></p>`;
      }
    }

    console.log("📨 Sending email to:", email);
    await transporter.sendMail({
      from: `"Shop Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🛍 Your Order Confirmation",
      html: emailContent,
    });

    console.log("✅ Email sent successfully!");
    res.status(200).json({ success: true, message: "Email sent successfully!" });

  } catch (error) {
    console.error("🚨 Error in /send-email:", error);
    res.status(500).json({ success: false, message: "Failed to send email. Please try again." });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
