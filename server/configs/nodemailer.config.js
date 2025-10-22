import SibApiV3Sdk from "@sendinblue/client";

const brevo = new SibApiV3Sdk.TransactionalEmailsApi();
brevo.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendEmail = async ({ to, subject, htmlContent }) => {
  try {
    await brevo.sendTransacEmail({
      sender: { email: "yourverifiedemail@domain.com", name: "Your App" },
      to: [{ email: to }],
      subject,
      htmlContent,
    });
    console.log("✅ Email sent successfully!");
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
};
