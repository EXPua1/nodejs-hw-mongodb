import { UserCollection } from '../db/models/User.js';
import { SessionsCollection } from '../db/models/sesion.js';

import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';

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
  console.log(payload)
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
 }

export const getSession = (filter) => SessionsCollection.findOne(filter);

export const getUser = (filter) => UserCollection.findOne(filter);
