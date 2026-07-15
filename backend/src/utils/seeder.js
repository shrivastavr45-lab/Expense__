import 'dotenv/config';
import mongoose from 'mongoose';
import User     from '../models/User.js';
import Category from '../models/Category.js';

const categories = [
  { name:'Food & Dining',  type:'EXPENSE', color:'#f97316', icon:'utensils',       system:true },
  { name:'Transportation', type:'EXPENSE', color:'#3b82f6', icon:'car',            system:true },
  { name:'Shopping',       type:'EXPENSE', color:'#ec4899', icon:'shopping-bag',   system:true },
  { name:'Entertainment',  type:'EXPENSE', color:'#8b5cf6', icon:'film',           system:true },
  { name:'Healthcare',     type:'EXPENSE', color:'#ef4444', icon:'heart',          system:true },
  { name:'Housing',        type:'EXPENSE', color:'#84cc16', icon:'home',           system:true },
  { name:'Utilities',      type:'EXPENSE', color:'#06b6d4', icon:'zap',            system:true },
  { name:'Education',      type:'EXPENSE', color:'#f59e0b', icon:'book',           system:true },
  { name:'Travel',         type:'EXPENSE', color:'#14b8a6', icon:'plane',          system:true },
  { name:'Other Expense',  type:'EXPENSE', color:'#6b7280', icon:'more-horizontal',system:true },
  { name:'Salary',         type:'INCOME',  color:'#22c55e', icon:'briefcase',      system:true },
  { name:'Freelance',      type:'INCOME',  color:'#10b981', icon:'code',           system:true },
  { name:'Investment',     type:'INCOME',  color:'#6366f1', icon:'trending-up',    system:true },
  { name:'Other Income',   type:'INCOME',  color:'#a3e635', icon:'plus-circle',    system:true },
];

await mongoose.connect(process.env.MONGO_URI);

// Admin user
const adminExists = await User.findOne({ email: 'admin@expensetracker.com' });
if (!adminExists) {
  const admin = new User({
    username: 'admin', email: 'admin@expensetracker.com',
    password: 'Admin@123', firstName: 'System', lastName: 'Admin',
    roles: ['ROLE_USER','ROLE_ADMIN'], enabled: true, emailVerified: true,
  });
  await admin.save();
  console.log('Admin seeded → admin@expensetracker.com / Admin@123');
}

// System categories
const count = await Category.countDocuments({ system: true });
if (count === 0) {
  await Category.insertMany(categories);
  console.log('14 system categories seeded');
}

console.log('Seeding complete');
await mongoose.disconnect();
