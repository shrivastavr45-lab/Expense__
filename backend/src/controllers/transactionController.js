import Transaction from '../models/Transaction.js';
import Category    from '../models/Category.js';
import Budget      from '../models/Budget.js';
import { audit }   from '../services/auditService.js';

const toRes = (t) => ({
  id: t._id, amount: parseFloat(t.amount), type: t.type,
  description: t.description,
  transactionDate: t.transactionDate,
  notes: t.notes,
  categoryId: t.categoryId, categoryName: t.categoryName,
  categoryColor: t.categoryColor, categoryIcon: t.categoryIcon,
  createdAt: t.createdAt,
});

const updateBudgetSpent = async (userId, categoryId, txDate, amount, add) => {
  const date  = new Date(txDate);
  const budgets = await Budget.find({
    userId, categoryId,
    startDate: { $lte: date },
    endDate:   { $gte: date },
  });
  for (const b of budgets) {
    const cur    = parseFloat(b.spentAmount);
    const delta  = parseFloat(amount);
    b.spentAmount = Math.max(0, add ? cur + delta : cur - delta);
    await b.save();
    // Budget alert check
    if (!b.alertSent && b.usagePercentage >= b.alertThreshold) {
      const { sendBudgetAlertEmail } = await import('../services/emailService.js');
      const { default: User }        = await import('../models/User.js');
      const user = await User.findById(userId);
      if (user) sendBudgetAlertEmail(user, b).catch(console.error);
      b.alertSent = true;
      await b.save();
    }
  }
};

export const getTransactions = async (req, res) => {
  const { page = 0, size = 20, type, categoryId, from, to, search } = req.query;
  const filter = { userId: req.user._id };
  if (type)       filter.type       = type;
  if (categoryId) filter.categoryId = categoryId;
  if (from || to) {
    filter.transactionDate = {};
    if (from) filter.transactionDate.$gte = new Date(from);
    if (to)   filter.transactionDate.$lte = new Date(to);
  }
  if (search) filter.description = { $regex: search, $options: 'i' };

  const skip  = parseInt(page) * parseInt(size);
  const [content, total] = await Promise.all([
    Transaction.find(filter).sort({ transactionDate: -1 }).skip(skip).limit(parseInt(size)),
    Transaction.countDocuments(filter),
  ]);
  res.json({
    content: content.map(toRes), page: parseInt(page),
    size: parseInt(size), totalElements: total,
    totalPages: Math.ceil(total / parseInt(size)),
    first: parseInt(page) === 0, last: (parseInt(page) + 1) * parseInt(size) >= total,
  });
};

export const getRecent = async (req, res) => {
  const txs = await Transaction.find({ userId: req.user._id }).sort({ transactionDate: -1 }).limit(5);
  res.json(txs.map(toRes));
};

export const getTransaction = async (req, res) => {
  const tx = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
  if (!tx) throw Object.assign(new Error('Transaction not found'), { status: 404 });
  res.json(toRes(tx));
};

export const createTransaction = async (req, res) => {
  const { amount, type, categoryId, description, transactionDate, notes } = req.body;
  const cat = await Category.findOne({
    _id: categoryId,
    $or: [{ userId: req.user._id }, { system: true }],
  });
  if (!cat) throw Object.assign(new Error('Category not found'), { status: 404 });

  const tx = await Transaction.create({
    userId: req.user._id, categoryId: cat._id, categoryName: cat.name,
    categoryColor: cat.color, categoryIcon: cat.icon,
    amount, type, description, transactionDate, notes,
  });

  if (type === 'EXPENSE')
    await updateBudgetSpent(req.user._id, cat._id, transactionDate, amount, true);

  await audit(req.user._id, req.user.email, 'CREATE', 'TRANSACTION', tx._id, null, toRes(tx), req);
  res.status(201).json(toRes(tx));
};

export const updateTransaction = async (req, res) => {
  const tx = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
  if (!tx) throw Object.assign(new Error('Transaction not found'), { status: 404 });
  const old = toRes(tx);

  // Reverse old budget impact
  if (tx.type === 'EXPENSE')
    await updateBudgetSpent(req.user._id, tx.categoryId, tx.transactionDate, tx.amount, false);

  const { amount, type, categoryId, description, transactionDate, notes } = req.body;
  const cat = await Category.findOne({ _id: categoryId, $or: [{ userId: req.user._id }, { system: true }] });
  if (!cat) throw Object.assign(new Error('Category not found'), { status: 404 });

  Object.assign(tx, {
    categoryId: cat._id, categoryName: cat.name,
    categoryColor: cat.color, categoryIcon: cat.icon,
    amount, type, description, transactionDate, notes,
  });
  await tx.save();

  if (type === 'EXPENSE')
    await updateBudgetSpent(req.user._id, cat._id, transactionDate, amount, true);

  await audit(req.user._id, req.user.email, 'UPDATE', 'TRANSACTION', tx._id, old, toRes(tx), req);
  res.json(toRes(tx));
};

export const deleteTransaction = async (req, res) => {
  const tx = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
  if (!tx) throw Object.assign(new Error('Transaction not found'), { status: 404 });

  if (tx.type === 'EXPENSE')
    await updateBudgetSpent(req.user._id, tx.categoryId, tx.transactionDate, tx.amount, false);

  await audit(req.user._id, req.user.email, 'DELETE', 'TRANSACTION', tx._id, toRes(tx), null, req);
  await tx.deleteOne();
  res.status(204).send();
};
