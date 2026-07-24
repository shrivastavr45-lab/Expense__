import { Router } from 'express';
import { body }   from 'express-validator';
import validate   from '../middleware/validate.js';
import * as ctrl  from '../controllers/authController.js';

const r = Router();
r.post('/signup',  [body('username').trim().isLength({min:3}), body('email').isEmail(), body('password').isLength({min:8}), validate], ctrl.signup);
r.post('/signin',  [body('email').isEmail(), body('password').notEmpty(), validate], ctrl.signin);
r.post('/refresh', ctrl.refreshToken);
export default r;
