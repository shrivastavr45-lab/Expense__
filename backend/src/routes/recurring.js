import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as ctrl   from '../controllers/recurringController.js';

const r = Router();
r.use(protect);
r.get ('/',            ctrl.getRecurring);
r.post('/',            ctrl.createRecurring);
r.put ('/:id',         ctrl.updateRecurring);
r.patch('/:id/toggle', ctrl.toggleRecurring);
r.delete('/:id',       ctrl.deleteRecurring);
export default r;
