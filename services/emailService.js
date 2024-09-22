const nodemailer = require("nodemailer");

// Asynchronous function to send an email
async function sendMail({ from, to, subject, text, html }) {
    try {
        // Create transporter using SMTP settings
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,       // Breva SMTP Host
            port: process.env.SMTP_PORT,       // Breva SMTP Port (587 for TLS, or 465 for SSL)
            secure: process.env.SMTP_SECURE === 'true', // true for SSL, false for TLS (change it in your .env)
            auth: {
                user: process.env.MAIL_USER,   // Breva Email Username or API key
                pass: process.env.MAIL_PASS    // Breva Email Password or API key
            },
            // Additional settings for debugging SMTP connection issues (optional)
            tls: {
                rejectUnauthorized: false      // Allow self-signed certificates (adjust if needed)
            }
        });

        // Set up email data
        let info = await transporter.sendMail({
            from: from,        // Sender address
            to: to,            // Receiver address (can be a string of emails separated by commas)
            subject: subject,  // Subject of the email
            text: text,        // Plain text version of the message (if needed)
            html: html         // HTML version of the email
        });

        // Log the result of the email sending
        console.log('Email sent successfully: %s', info.messageId);
    } catch (error) {
        // Handle errors in email sending
        console.error('Error occurred while sending email:', error.message);
        throw new Error('Email sending failed'); // Optional: throw an error to handle it in the calling function
    }
}

module.exports = sendMail;
