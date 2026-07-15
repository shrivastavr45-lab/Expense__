import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as ctrl   from '../controllers/transactionController.js';

const r = Router();
r.use(protect);
r.get ('/',        ctrl.getTransactions);
r.get ('/recent',  ctrl.getRecent);
r.get ('/:id',     ctrl.getTransaction);
r.post('/',        ctrl.createTransaction);
r.put ('/:id',     ctrl.updateTransaction);
r.delete('/:id',   ctrl.deleteTransaction);
export default r;
