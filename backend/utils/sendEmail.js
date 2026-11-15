const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOtpEmail = async (to, subject, otp) => {
  await transporter.sendMail({
    from: `"Restaurant app" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `<p>Your OTP for password reset is: <b>${otp}</b></p>
    <p>Note: This OTP is valid for 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thank you,</p>
    <p>Restaurant App Team</p>`,
  });
};

module.exports = sendOtpEmail;
