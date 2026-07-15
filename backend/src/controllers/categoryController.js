import Category from '../models/Category.js';

const toRes = (c) => ({ id: c._id, name: c.name, type: c.type, color: c.color, icon: c.icon, system: c.system });

export const getCategories = async (req, res) => {
  const cats = await Category.find({ $or: [{ userId: req.user._id }, { system: true }] }).sort({ system: -1, name: 1 });
  res.json(cats.map(toRes));
};

export const createCategory = async (req, res) => {
  const { name, type, color, icon } = req.body;
  const exists = await Category.findOne({ name, userId: req.user._id });
  if (exists) throw Object.assign(new Error(`Category '${name}' already exists`), { status: 400 });
  const cat = await Category.create({ userId: req.user._id, name, type, color: color || '#6366F1', icon: icon || 'tag' });
  res.status(201).json(toRes(cat));
};

export const updateCategory = async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) throw Object.assign(new Error('Category not found'), { status: 404 });
  if (cat.system) throw Object.assign(new Error('Cannot modify system categories'), { status: 400 });
  if (!cat.userId?.equals(req.user._id)) throw Object.assign(new Error('Forbidden'), { status: 403 });
  Object.assign(cat, req.body);
  await cat.save();
  res.json(toRes(cat));
};

export const deleteCategory = async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) throw Object.assign(new Error('Category not found'), { status: 404 });
  if (cat.system) throw Object.assign(new Error('Cannot delete system categories'), { status: 400 });
  if (!cat.userId?.equals(req.user._id)) throw Object.assign(new Error('Forbidden'), { status: 403 });
  await cat.deleteOne();
  res.status(204).send();
};
