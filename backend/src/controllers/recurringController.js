import RecurringExpense from '../models/RecurringExpense.js';
import Category         from '../models/Category.js';

const toRes = (r) => ({
  id: r._id, categoryId: r.categoryId, categoryName: r.categoryName,
  amount: parseFloat(r.amount), description: r.description,
  intervalType: r.intervalType, nextDueDate: r.nextDueDate,
  endDate: r.endDate, active: r.active, notes: r.notes,
});

export const getRecurring = async (req, res) => {
  const items = await RecurringExpense.find({ userId: req.user._id });
  res.json(items.map(toRes));
};

export const createRecurring = async (req, res) => {
  const { categoryId, amount, description, intervalType, startDate, endDate, notes } = req.body;
  const cat = await Category.findOne({ _id: categoryId, $or: [{ userId: req.user._id }, { system: true }] });
  if (!cat) throw Object.assign(new Error('Category not found'), { status: 404 });

  const item = await RecurringExpense.create({
    userId: req.user._id, categoryId: cat._id, categoryName: cat.name,
    amount, description, intervalType, nextDueDate: startDate, endDate, notes,
  });
  res.status(201).json(toRes(item));
};

export const updateRecurring = async (req, res) => {
  const item = await RecurringExpense.findOne({ _id: req.params.id, userId: req.user._id });
  if (!item) throw Object.assign(new Error('Recurring expense not found'), { status: 404 });
  const { categoryId, amount, description, intervalType, startDate, endDate, notes } = req.body;
  if (categoryId) {
    const cat = await Category.findOne({ _id: categoryId, $or: [{ userId: req.user._id }, { system: true }] });
    if (!cat) throw Object.assign(new Error('Category not found'), { status: 404 });
    item.categoryId = cat._id; item.categoryName = cat.name;
  }
  Object.assign(item, { amount, description, intervalType, nextDueDate: startDate, endDate, notes });
  await item.save();
  res.json(toRes(item));
};

export const toggleRecurring = async (req, res) => {
  const item = await RecurringExpense.findOne({ _id: req.params.id, userId: req.user._id });
  if (!item) throw Object.assign(new Error('Recurring expense not found'), { status: 404 });
  item.active = !item.active;
  await item.save();
  res.json({ success: true, active: item.active });
};

export const deleteRecurring = async (req, res) => {
  const item = await RecurringExpense.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!item) throw Object.assign(new Error('Recurring expense not found'), { status: 404 });
  res.status(204).send();
};
