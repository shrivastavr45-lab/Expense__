import Transaction from '../models/Transaction.js';
import mongoose    from 'mongoose';

const buildSummary = async (userId, from, to) => {
  const match = {
    userId: new mongoose.Types.ObjectId(userId),
    transactionDate: { $gte: new Date(from), $lte: new Date(to) },
  };

  // Total income + expenses
  const totals = await Transaction.aggregate([
    { $match: match },
    { $group: { _id: '$type', total: { $sum: { $toDouble: '$amount' } } } },
  ]);
  const totalIncome   = totals.find(t => t._id === 'INCOME')?.total  || 0;
  const totalExpenses = totals.find(t => t._id === 'EXPENSE')?.total || 0;

  // Monthly breakdown
  const monthly = await Transaction.aggregate([
    { $match: match },
    { $group: {
        _id: { year: { $year: '$transactionDate' }, month: { $month: '$transactionDate' }, type: '$type' },
        total: { $sum: { $toDouble: '$amount' } },
    }},
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Build monthly map
  const monthMap = {};
  const months   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  for (const row of monthly) {
    const key = `${row._id.year}-${String(row._id.month).padStart(2,'0')}`;
    if (!monthMap[key]) monthMap[key] = {
      month: row._id.month, year: row._id.year,
      monthLabel: `${months[row._id.month - 1]} ${row._id.year}`,
      income: 0, expenses: 0,
    };
    if (row._id.type === 'INCOME')  monthMap[key].income   = row.total;
    else                            monthMap[key].expenses = row.total;
  }

  // Category breakdown (expenses only)
  const catRaw = await Transaction.aggregate([
    { $match: { ...match, type: 'EXPENSE' } },
    { $group: { _id: '$categoryName', total: { $sum: { $toDouble: '$amount' } } } },
    { $sort: { total: -1 } },
  ]);
  const categoryBreakdown = catRaw.map(c => ({
    category:   c._id,
    amount:     c.total,
    percentage: totalExpenses > 0 ? (c.total / totalExpenses) * 100 : 0,
  }));

  return {
    totalIncome, totalExpenses, netBalance: totalIncome - totalExpenses,
    monthlyData: Object.values(monthMap),
    categoryBreakdown,
  };
};

export const getSummary = async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) throw Object.assign(new Error('from and to dates required'), { status: 400 });
  res.json(await buildSummary(req.user._id, from, to));
};

export const getCurrentMonth = async (req, res) => {
  const now   = new Date();
  const from  = new Date(now.getFullYear(), now.getMonth(), 1);
  const to    = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  res.json(await buildSummary(req.user._id, from, to));
};

export const getLast12Months = async (req, res) => {
  const to   = new Date();
  const from = new Date(to.getFullYear(), to.getMonth() - 11, 1);
  res.json(await buildSummary(req.user._id, from, to));
};
