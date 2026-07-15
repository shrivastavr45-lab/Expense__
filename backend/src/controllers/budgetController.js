import Budget      from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import Category    from '../models/Category.js';

const toRes = (b) => ({
  id: b._id, categoryId: b.categoryId, categoryName: b.categoryName, categoryColor: b.categoryColor,
  limitAmount: parseFloat(b.limitAmount), spentAmount: parseFloat(b.spentAmount),
  remainingAmount: Math.max(0, parseFloat(b.limitAmount) - parseFloat(b.spentAmount)),
  usagePercentage: b.usagePercentage, period: b.period,
  startDate: b.startDate, endDate: b.endDate,
  alertThreshold: b.alertThreshold, alertSent: b.alertSent, overBudget: b.overBudget,
});

export const getActiveBudgets = async (req, res) => {
  const today = new Date();
  const budgets = await Budget.find({
    userId: req.user._id,
    startDate: { $lte: today }, endDate: { $gte: today },
  });
  res.json(budgets.map(toRes));
};

export const getAllBudgets = async (req, res) => {
  const budgets = await Budget.find({ userId: req.user._id });
  res.json(budgets.map(toRes));
};

export const createBudget = async (req, res) => {
  const { categoryId, limitAmount, period, startDate, endDate, alertThreshold } = req.body;
  const cat = await Category.findOne({ _id: categoryId, $or: [{ userId: req.user._id }, { system: true }] });
  if (!cat) throw Object.assign(new Error('Category not found'), { status: 404 });

  const exists = await Budget.findOne({ userId: req.user._id, categoryId, startDate: new Date(startDate) });
  if (exists) throw Object.assign(new Error('Budget for this category and period already exists'), { status: 400 });

  // Back-fill spent from existing transactions
  const txs = await Transaction.find({
    userId: req.user._id, categoryId, type: 'EXPENSE',
    transactionDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
  });
  const spent = txs.reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const budget = await Budget.create({
    userId: req.user._id, categoryId: cat._id, categoryName: cat.name,
    categoryColor: cat.color, limitAmount, spentAmount: spent, period,
    startDate, endDate, alertThreshold: alertThreshold || 80,
  });
  res.status(201).json(toRes(budget));
};

export const updateBudget = async (req, res) => {
  const budget = await Budget.findOne({ _id: req.params.id, userId: req.user._id });
  if (!budget) throw Object.assign(new Error('Budget not found'), { status: 404 });
  const { limitAmount, alertThreshold, endDate } = req.body;
  budget.limitAmount     = limitAmount     ?? budget.limitAmount;
  budget.alertThreshold  = alertThreshold  ?? budget.alertThreshold;
  budget.endDate         = endDate         ?? budget.endDate;
  budget.alertSent       = false;
  await budget.save();
  res.json(toRes(budget));
};

export const deleteBudget = async (req, res) => {
  const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!budget) throw Object.assign(new Error('Budget not found'), { status: 404 });
  res.status(204).send();
};
