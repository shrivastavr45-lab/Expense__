import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as ctrl   from '../controllers/analyticsController.js';

const r = Router();
r.use(protect);
r.get('/summary',       ctrl.getSummary);
r.get('/current-month', ctrl.getCurrentMonth);
r.get('/last-12-months',ctrl.getLast12Months);
export default r;
