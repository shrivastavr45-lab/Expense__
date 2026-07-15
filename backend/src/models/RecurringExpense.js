import mongoose from 'mongoose';

const recurringSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  categoryName: { type: String },
  amount:       { type: mongoose.Decimal128, required: true },
  description:  { type: String, required: true, maxlength: 200 },
  intervalType: { type: String, enum: ['DAILY', 'WEEKLY', 'MONTHLY'], required: true },
  nextDueDate:  { type: Date, required: true },
  endDate:      { type: Date },
  notes:        { type: String },
  active:       { type: Boolean, default: true },
}, { timestamps: true });

recurringSchema.index({ active: 1, nextDueDate: 1 });
recurringSchema.index({ userId: 1 });

export default mongoose.model('RecurringExpense', recurringSchema);
