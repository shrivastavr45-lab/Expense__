import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId:              { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  categoryName:        { type: String },
  categoryColor:       { type: String },
  categoryIcon:        { type: String },
  amount:              { type: mongoose.Decimal128, required: true },
  type:                { type: String, required: true, enum: ['INCOME', 'EXPENSE'] },
  description:         { type: String, required: true, maxlength: 200 },
  transactionDate:     { type: Date, required: true },
  notes:               { type: String },
  recurringExpenseId:  { type: mongoose.Schema.Types.ObjectId, ref: 'RecurringExpense' },
}, { timestamps: true });

transactionSchema.index({ userId: 1, transactionDate: -1 });
transactionSchema.index({ userId: 1, categoryId: 1 });

export default mongoose.model('Transaction', transactionSchema);
