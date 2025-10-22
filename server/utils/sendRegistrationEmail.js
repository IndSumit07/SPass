import SibApiV3Sdk from "@sendinblue/client";

const brevo = new SibApiV3Sdk.TransactionalEmailsApi();
brevo.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendRegistrationEmail = async (email, fullName) => {
  try {
    const emailData = {
      sender: {
        email: process.env.EMAIL_FROM, // e.g. yourverifiedemail@domain.com
        name: "SPass",
      },
      to: [{ email }],
      subject: "Welcome to Our SPass!",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; border: 1px solid #eee;">
            <h2 style="color: #ff6500; text-align:center;">Welcome, ${fullName}!</h2>
            <p>Thank you for registering with us. Your account has been created successfully.</p>
            <p>You can now log in and start using our services.</p>
            <hr style="margin: 20px 0; border:none; border-top:1px solid #eee;" />
            <p style="font-size: 12px; color: #888; text-align:center;">
              If you didn’t register, please ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    await brevo.sendTransacEmail(emailData);
    console.log(`📧 Registration email sent successfully to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send registration email:", error.message);
    throw new Error("Unable to send registration email");
  }
};
