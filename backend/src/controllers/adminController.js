import User      from '../models/User.js';
import Transaction from '../models/Transaction.js';
import AuditLog  from '../models/AuditLog.js';

const userRes = (u) => ({
  id: u._id, username: u.username, email: u.email,
  firstName: u.firstName, lastName: u.lastName,
  roles: u.roles, enabled: u.enabled, emailVerified: u.emailVerified,
  currency: u.currency, createdAt: u.createdAt,
});

const txRes = (t) => ({
  id: t._id, amount: parseFloat(t.amount), type: t.type,
  description: t.description, transactionDate: t.transactionDate,
  categoryName: t.categoryName, categoryColor: t.categoryColor,
  createdAt: t.createdAt,
});

const paged = (content, total, page, size) => ({
  content, totalElements: total, page, size,
  totalPages: Math.ceil(total / size),
  first: page === 0, last: (page + 1) * size >= total,
});

export const getUsers = async (req, res) => {
  const { page = 0, size = 20, search } = req.query;
  const filter = search ? {
    $or: [
      { email:    { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
      { firstName:{ $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
    ]
  } : {};
  const skip = parseInt(page) * parseInt(size);
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(size)),
    User.countDocuments(filter),
  ]);
  res.json(paged(users.map(userRes), total, parseInt(page), parseInt(size)));
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  res.json(userRes(user));
};

export const toggleUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  user.enabled = !user.enabled;
  await user.save();
  res.json({ success: true, enabled: user.enabled });
};

export const getAdminTransactions = async (req, res) => {
  const { page = 0, size = 50, search, userId, type } = req.query;
  const filter = {};
  if (userId) filter.userId = userId;
  if (type)   filter.type   = type;
  if (search) filter.description = { $regex: search, $options: 'i' };
  const skip = parseInt(page) * parseInt(size);
  const [txs, total] = await Promise.all([
    Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(size)),
    Transaction.countDocuments(filter),
  ]);
  res.json(paged(txs.map(txRes), total, parseInt(page), parseInt(size)));
};

export const getAuditLogs = async (req, res) => {
  const { page = 0, size = 50, userId, action, entityType } = req.query;
  const filter = {};
  if (userId)     filter.userId     = userId;
  if (action)     filter.action     = action;
  if (entityType) filter.entityType = entityType;
  const skip = parseInt(page) * parseInt(size);
  const [logs, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(size)),
    AuditLog.countDocuments(filter),
  ]);
  res.json(paged(logs.map(l => ({
    id: l._id, userId: l.userId, userEmail: l.userEmail,
    action: l.action, entityType: l.entityType, entityId: l.entityId,
    oldValues: l.oldValues, newValues: l.newValues,
    ipAddress: l.ipAddress, createdAt: l.createdAt,
  })), total, parseInt(page), parseInt(size)));
};
