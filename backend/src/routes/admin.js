import { Router }        from 'express';
import { protect, requireRole } from '../middleware/auth.js';
import * as ctrl         from '../controllers/adminController.js';

const r = Router();
r.use(protect, requireRole('ROLE_ADMIN'));
r.get ('/users',              ctrl.getUsers);
r.get ('/users/:id',          ctrl.getUser);
r.patch('/users/:id/toggle',  ctrl.toggleUser);
r.get ('/transactions',       ctrl.getAdminTransactions);
r.get ('/audit',              ctrl.getAuditLogs);
export default r;
