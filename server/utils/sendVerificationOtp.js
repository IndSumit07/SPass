import { transporter } from "../configs/nodemailer.config.js";

export const sendVerificationOtp = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your OTP Code for Verification",
      html: `
        <div style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
          <div style="max-width:500px; margin:auto; background:white; padding:20px; border-radius:10px; border:1px solid #eee;">
            <h2 style="text-align:center; color:#ff6500;">Email Verification</h2>
            <p>Dear User,</p>
            <p>Your One-Time Password (OTP) for account verification is:</p>
            <h1 style="color:#ff6500; text-align:center; letter-spacing:3px;">${otp}</h1>
            <p>This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.</p>
            <hr style="margin:20px 0; border:none; border-top:1px solid #eee;" />
            <p style="font-size:12px; text-align:center; color:#888;">
              If you didn’t request this, please ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Unable to send OTP email");
  }
};
