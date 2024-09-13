import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
          from: sender,
          to: recipient,
          template_uuid: "fdfbcc39-f079-4861-b5f2-38ef4cffd006",
          template_variables: {
            code: verificationToken,
          },
        });
    } catch (error) {
        console.error(`Error sending verification email: ${error}`);
        throw new Error(`Error sending verification email: ${error}`);
    }
}

export const sendWelcomeEmail = async (email, username) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "b97c4080-7efa-4bbc-91d7-a2279e5b07bc",
            template_variables: {
                company_info_name: "CipherSafe",
                name: username
            }
        })
    } catch (error) {
        console.error(`Error sending welcome email: ${error}`);
        throw new Error(`Error sending welcome email: ${error}`);
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
        const recipient = [{ email }];

        try {
          const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "",
            template_variables: {
              resetURL: resetURL,
            },
          });
        } catch (error) {
          console.error(`Error sending password reset email: ${error}`);
          throw new Error(`Error sending password reset email: ${error}`);
        }
}

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "",
    });

    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset success email`, error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
}; 