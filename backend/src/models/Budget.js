import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  categoryName:   { type: String },
  categoryColor:  { type: String },
  limitAmount:    { type: mongoose.Decimal128, required: true },
  spentAmount:    { type: mongoose.Decimal128, default: 0 },
  period:         { type: String, enum: ['WEEKLY', 'MONTHLY', 'YEARLY'], default: 'MONTHLY' },
  startDate:      { type: Date, required: true },
  endDate:        { type: Date, required: true },
  alertThreshold: { type: Number, default: 80, min: 1, max: 100 },
  alertSent:      { type: Boolean, default: false },
}, { timestamps: true });

budgetSchema.index({ userId: 1 });
budgetSchema.index({ userId: 1, categoryId: 1, startDate: 1 }, { unique: true });

budgetSchema.virtual('usagePercentage').get(function () {
  const limit = parseFloat(this.limitAmount);
  if (!limit) return 0;
  return (parseFloat(this.spentAmount) / limit) * 100;
});

budgetSchema.virtual('overBudget').get(function () {
  return parseFloat(this.spentAmount) >= parseFloat(this.limitAmount);
});

budgetSchema.set('toJSON', { virtuals: true });
budgetSchema.set('toObject', { virtuals: true });

export default mongoose.model('Budget', budgetSchema);
