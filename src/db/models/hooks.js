import createHttpError from 'http-errors';

export const handleSaveError = async (error, doc, next) => {
  const { name, code } = error;
    error.status = (name === 'MongoError' && code === 11000) ? 409 : 400;
    next(error);
};

export const setUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
