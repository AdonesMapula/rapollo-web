const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
require("dotenv").config();

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Cloud Function to send email
exports.sendOrderConfirmation = functions.firestore
  .document("solditems/{orderId}")
  .onCreate((snap, context) => {
    const orderData = snap.data();

    const adminMailOptions = {
      from: `"Your Shop" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order: ${orderData.transactionId}`,
      text: `A new order has been placed.\n\nOrder Details:\n\n${JSON.stringify(orderData, null, 2)}`,
    };

    const userMailOptions = {
      from: `"Your Shop" <${process.env.EMAIL_USER}>`,
      to: orderData.email,
      subject: `Order Confirmation - ${orderData.transactionId}`,
      text: `Hello ${orderData.customerName},\n\nThank you for your order!\n\nOrder Details:\n\n${JSON.stringify(orderData, null, 2)}`,
    };

    return Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ])
      .then(() => console.log("Emails sent successfully!"))
      .catch((error) => console.error("Error sending email:", error));
  });
