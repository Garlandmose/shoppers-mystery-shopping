// ✅ server.js — FULL, WORKING VERSION
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

// 🔹 1. Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});

// 🔹 2. Middleware
app.use(express.static('public')); // serve HTML/CSS/JS
app.use(express.urlencoded({ extended: true })); // parse form data

// 🔹 3. Email transporter (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 🔹 4. Route: Serve homepage (optional — static does this, but good to have)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔹 5. Route: Handle form submission
app.post('/submit-application', async (req, res) => {
    const { name, address, city, state, zip, country, phone, email } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `NewProposal: ${name}`,
        html: `
      <h2>📝 New Mystery Shopper Application</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Address:</strong> ${address}, ${city}, ${state} ${zip}, ${country}</p>
      <hr>
      <p><em>Submitted via Shoppers website</em></p>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({
            success: true,
            message: '✅ Application submitted successfully! A representative will contact you soon.'
        });
    } catch (error) {
        console.error('📧 Email error:', error.message);
        res.status(500).json({
            success: false,
            message: '❌ Submission failed. Please try again or email support directly.'
        });
    }
});

// 🔹 6. Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📄 Open your browser and visit: http://localhost:${PORT}`);
});