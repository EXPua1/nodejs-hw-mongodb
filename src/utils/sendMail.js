import nodemailer from 'nodemailer';

import { SMTP } from '../constants/index.js';
import { env } from './env.js';

import createHttpError from 'http-errors';

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),

  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
  logger: true,
  debug: true,
});

export const sendEmail = async (options) => {
  try {
    const email = await transporter.sendMail(options);
    console.log('Email sent:', email.response);
    return email;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};
