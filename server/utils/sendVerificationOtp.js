import SibApiV3Sdk from "@sendinblue/client";

const brevo = new SibApiV3Sdk.TransactionalEmailsApi();
brevo.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendVerificationOtp = async (email, otp) => {
  try {
    const emailData = {
      sender: {
        email: process.env.EMAIL_FROM, // must be verified in Brevo
        name: "SPass Verification",
      },
      to: [{ email }],
      subject: "Your OTP Code for Verification",
      htmlContent: `
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

    await brevo.sendTransacEmail(emailData);
    console.log(`📧 OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error.message);
    throw new Error("Unable to send OTP email");
  }
};
