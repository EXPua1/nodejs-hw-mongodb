import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError)
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
    });

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    err: err.message,
  });
};