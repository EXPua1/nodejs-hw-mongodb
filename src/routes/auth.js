import Router from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  loginWithGoogleOAuthSchema,
} from '../validation/auth.js';
import * as authController from '../controllers/auth.js';
import { get } from 'mongoose';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(authController.registerController),
);
authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(authController.loginController),
);

authRouter.post('/refresh', ctrlWrapper(authController.refreshTokenController));
authRouter.post('/logout', ctrlWrapper(authController.logOutController));

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(authController.requestResetEmailController),
);
authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(authController.resetPasswordController),
);
authRouter.get(
  '/get-oauth-url',
  ctrlWrapper(authController.getGoogleOAuthUrlController),
);

authRouter.post(
  '/confirm-google-auth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(authController.loginWithGoogleController),
);

export default authRouter;
