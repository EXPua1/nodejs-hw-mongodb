import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  try {
    if (!isValidObjectId(contactId)) {
      throw createHttpError(400, `Incorrect id ${contactId}`);
    }
    next();
  } catch (error) {
    next(error);
  }
};
