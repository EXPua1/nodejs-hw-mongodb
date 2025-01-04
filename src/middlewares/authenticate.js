import createHttpError from 'http-errors';

import { getSession, getUser } from '../services/auth.js';

export const authenticate = async (req, res, next) => {
  //   const { autorization } = req.headers;
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header is required!'));
  }

  const [bearer, accessToken] = authHeader.split(' ');
  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Header must be "Bearer [token]"!'));
  }

  const sesion = await getSession({accessToken});
  if (!sesion) {
    return next(createHttpError(401, 'Invalid token!'));
  }

  if (Date.now() > sesion.accessTokenValidUntil) {
    return next(createHttpError(401, 'Access token expired!'));
  }

  const user = await getUser({ _id: sesion.userId });

  if (!user) {
    return next(createHttpError(401, 'User not found!'));
  }

  req.user = user;
  next();
};
