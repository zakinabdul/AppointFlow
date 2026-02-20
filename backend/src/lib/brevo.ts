import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.BREVO_API_KEY) {
    throw new Error('Missing BREVO_API_KEY environment variable');
}

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

export const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmail = async ({ to, subject, html }: { to: string, subject: string, html: string }) => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = {
        name: "AppointFlow",
        email: process.env.BREVO_SENDER_EMAIL || "zakinabdul.tech@gmail.com"
    };
    sendSmtpEmail.to = [{ email: to }];

    return await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
};
