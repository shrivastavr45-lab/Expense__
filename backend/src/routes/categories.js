import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as ctrl   from '../controllers/categoryController.js';

const r = Router();
r.use(protect);
r.get ('/',      ctrl.getCategories);
r.post('/',      ctrl.createCategory);
r.put ('/:id',   ctrl.updateCategory);
r.delete('/:id', ctrl.deleteCategory);
export default r;
