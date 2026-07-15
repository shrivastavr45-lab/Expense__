import cron              from 'node-cron';
import RecurringExpense  from '../models/RecurringExpense.js';
import Transaction       from '../models/Transaction.js';
import Budget            from '../models/Budget.js';

const addDays  = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const addWeeks = (d, n) => addDays(d, n * 7);
const addMonths= (d, n) => { const r = new Date(d); r.setMonth(r.getMonth() + n); return r; };

const nextDate = (re) => {
  switch (re.intervalType) {
    case 'DAILY':   return addDays(re.nextDueDate, 1);
    case 'WEEKLY':  return addWeeks(re.nextDueDate, 1);
    case 'MONTHLY': return addMonths(re.nextDueDate, 1);
  }
};

export const startScheduler = () => {
  // Daily at 00:05 — process recurring expenses
  cron.schedule('5 0 * * *', async () => {
    const today = new Date(); today.setHours(0,0,0,0);
    const due = await RecurringExpense.find({
      active: true,
      nextDueDate: { $lte: today },
      $or: [{ endDate: null }, { endDate: { $gte: today } }],
    });
    console.log(`[Scheduler] Processing ${due.length} recurring expenses for ${today.toDateString()}`);
    for (const re of due) {
      try {
        const tx = await Transaction.create({
          userId: re.userId, categoryId: re.categoryId,
          categoryName: re.categoryName, amount: re.amount,
          type: 'EXPENSE',
          description: `${re.description} (Recurring)`,
          transactionDate: today, notes: re.notes,
          recurringExpenseId: re._id,
        });
        // Update budgets
        const budgets = await Budget.find({
          userId: re.userId, categoryId: re.categoryId,
          startDate: { $lte: today }, endDate: { $gte: today },
        });
        for (const b of budgets) {
          b.spentAmount = parseFloat(b.spentAmount) + parseFloat(re.amount);
          await b.save();
        }
        re.nextDueDate = nextDate(re);
        await re.save();
        console.log(`[Scheduler] Created tx for recurring ${re._id}`);
      } catch (err) {
        console.error(`[Scheduler] Failed recurring ${re._id}:`, err.message);
      }
    }
  });

  console.log('[Scheduler] Recurring expense job registered (daily 00:05)');
};
