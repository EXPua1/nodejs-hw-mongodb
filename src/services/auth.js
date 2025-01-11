import { UserCollection } from '../db/models/User.js';
import { SessionsCollection } from '../db/models/sesion.js';

import jwt from 'jsonwebtoken';

import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import path from "node:path"
import { readFile } from 'node:fs/promises';

import Handlebars from 'handlebars';

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';
import { env } from '../utils/env.js';

import { sendEmail } from '../utils/sendMail.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';



// const emailTemplatePath = path.join(TEMPLATE_DIR, 'verify-email.html');
// const emailTemplateSource = await readFile(emailTemplatePath, 'utf-8');
// const appDomain = env('APP_DOMAIN');
// const jwtSecret = env('JWT_SECRET');
const emailTemplateResetPath = path.join(TEMPLATES_DIR, 'reset-password.html');
const emailTemplateSourceReset = await readFile(emailTemplateResetPath, 'utf-8');
const appDomain = env('APP_DOMAIN');
const jwtSecret = env('JWT_SECRET');



const createSessionData = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: Date.now() + accessTokenLifetime,
  refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
});

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use!');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });

  // const template = Handlebars.compile(emailTemplateSource);

  // const token = jwt.sign({email}, jwtSecret, {expiresIn: '1h'})

  // const html = template({
  //   link: `${appDomain}/verify?token=${token}`,
  // })

  // const verifyEmail = {
  //   from: env(SMTP.SMTP_FROM),
  //   to: email,
  //   subject: 'Verify email',
  //   html,
   
  // }
  // await sendEmail(verifyEmail);

  return newUser;
};

export const login = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw createHttpError(401, 'Invalid email or password');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const sessionData = createSessionData();
  return await SessionsCollection.create({
    userId: user._id,
    ...sessionData,
  });
};

export const refreshToken = async (payload) => {
  console.log(payload);
  const oldSession = await SessionsCollection.findOne({
    _id: payload.sessionId,
    refreshToken: payload.refreshToken,
  });

  if (!oldSession) {
    throw createHttpError(401, 'Session not found!');
  }

  if (Date.now() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token expired!');
  }

  await SessionsCollection.deleteOne({ _id: payload.sessionId });

  const sessionData = createSessionData();

  return await SessionsCollection.create({
    userId: oldSession.userId,
    ...sessionData,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const getSession = (filter) => SessionsCollection.findOne(filter);

export const getUser = (filter) => UserCollection.findOne(filter);

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  // const resetToken = jwt.sign(
  //   {
  //     sub: user._id,
  //     email,
  //   },
  //   env('JWT_SECRET'),
  //   {
  //     expiresIn: '5m',
  //   },
  // );

  // await sendEmail({
  //   from: env(SMTP.SMTP_FROM),
  //   to: email,
  //   subject: 'Reset password',
  //   html: `<p>Click <a href="${resetToken}">here</a> to reset your password!</p>`,
  // });

  const template = Handlebars.compile(emailTemplateSourceReset);

  const token = jwt.sign({email}, jwtSecret, {expiresIn: '2h'})

  const html = template({
    link: `${appDomain}/reset-password?token=${token}`,
  });

  const verifyEmail = {
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'reset password',
    html,

  }
  await sendEmail(verifyEmail);
};


export const resetPassword = async (payload) => {
 

    try {
      const {email} = jwt.verify(payload.token, jwtSecret);
      const user = await UserCollection.findOne({ email });
      if (!user) {
        throw createHttpError(404, 'User not found!');
      }
      const encryptedPassword = await bcrypt.hash(payload.password, 10);
      await UserCollection.updateOne(
        { _id: user._id },
        { password: encryptedPassword },
      );
    } catch (err) {
      if (err instanceof Error) throw createHttpError(401, 'Token is expired or invalid.');
      throw err;
  }
 
  
};