import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as ctrl   from '../controllers/budgetController.js';

const r = Router();
r.use(protect);
r.get ('/',        ctrl.getActiveBudgets);
r.get ('/all',     ctrl.getAllBudgets);
r.post('/',        ctrl.createBudget);
r.put ('/:id',     ctrl.updateBudget);
r.delete('/:id',   ctrl.deleteBudget);
export default r;
