import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name:   { type: String, required: true, trim: true, maxlength: 60 },
  type:   { type: String, required: true, enum: ['INCOME', 'EXPENSE'] },
  color:  { type: String, default: '#6366F1', match: /^#([A-Fa-f0-9]{6})$/ },
  icon:   { type: String, default: 'tag', maxlength: 50 },
  system: { type: Boolean, default: false },
});

categorySchema.index({ userId: 1 });
categorySchema.index({ system: 1 });

export default mongoose.model('Category', categorySchema);
