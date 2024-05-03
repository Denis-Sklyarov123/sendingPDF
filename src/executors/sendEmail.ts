import nodemailer from "nodemailer";
import { logger } from "../utils/loggerConfig";

export const sendEmail = async (emailObj: Record<string, any>) => {
  logger.info("sending email...");
  const transportOptions = {
    host: emailObj.host,
    port: emailObj.port,
    secure: false,
    auth: {
      user: emailObj.userName,
      pass: emailObj.pass,
    },
  };

  const smtpTransport = nodemailer.createTransport(transportOptions);

  try {
    const response = await smtpTransport.sendMail({
      from: emailObj.from,
      to: emailObj.to,
      subject: "Adding an attachment to a patient ID: " + emailObj.patientId,
      text:
        "The file " +
        emailObj.fileName +
        " was attached to a patient with an ID: " +
        emailObj.patientId,
      attachments: emailObj.attachments,
    });

    return response;
  } catch (err: any) {
    logger.error(`Send email failed with error ${err.message} at ${err.stack}`);
  }
};
