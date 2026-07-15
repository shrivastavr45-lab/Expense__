import { Router } from 'express';
import { body }   from 'express-validator';
import validate   from '../middleware/validate.js';
import * as ctrl  from '../controllers/authController.js';

const r = Router();
r.post('/signup',   [body('username').trim().isLength({min:3}), body('email').isEmail(), body('password').isLength({min:8}), validate], ctrl.signup);
r.post('/signin',   [body('email').isEmail(), body('password').notEmpty(), validate], ctrl.signin);
r.post('/refresh',  ctrl.refreshToken);
r.get ('/verify-email', ctrl.verifyEmail);
r.post('/resend-verification', [body('email').isEmail(), validate], ctrl.resendVerification);
r.post('/forgot-password', [body('email').isEmail(), validate], ctrl.forgotPassword);
r.post('/reset-password',  [body('token').notEmpty(), body('newPassword').isLength({min:8}), validate], ctrl.resetPassword);
export default r;
