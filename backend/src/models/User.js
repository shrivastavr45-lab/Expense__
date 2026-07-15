import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username:          { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 50 },
  email:             { type: String, required: true, unique: true, trim: true, lowercase: true },
  password:          { type: String, required: true, minlength: 8, select: false },
  firstName:         { type: String, trim: true, maxlength: 60 },
  lastName:          { type: String, trim: true, maxlength: 60 },
  roles:             { type: [String], default: ['ROLE_USER'] },
  enabled:           { type: Boolean, default: false },
  emailVerified:     { type: Boolean, default: false },
  currency:          { type: String, default: 'INR', maxlength: 10 },
  profilePictureUrl: { type: String },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export default mongoose.model('User', userSchema);
