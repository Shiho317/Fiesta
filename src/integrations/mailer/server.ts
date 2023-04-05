import type Mail from "nodemailer/lib/mailer";
import { createTransport } from "nodemailer";

export const sendEmail = async (message: Mail.Options, server: string) => {
  // const transport = createTransport(server);
  // const result = await transport.sendMail(message);
  // return result;
};
