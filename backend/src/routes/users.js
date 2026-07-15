import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as ctrl   from '../controllers/userController.js';

const r = Router();
r.use(protect);
r.get ('/',           ctrl.getMe);
r.put ('/',           ctrl.updateProfile);
r.put ('/password',   ctrl.changePassword);
export default r;
