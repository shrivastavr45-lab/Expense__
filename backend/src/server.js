import 'dotenv/config';
import 'express-async-errors';
import express     from 'express';
import cors        from 'cors';
import morgan      from 'morgan';
import rateLimit   from 'express-rate-limit';

import connectDB       from './config/db.js';
import errorHandler    from './middleware/errorHandler.js';
import { startScheduler } from './utils/scheduler.js';

// Routes
import authRoutes        from './routes/auth.js';
import userRoutes        from './routes/users.js';
import categoryRoutes    from './routes/categories.js';
import transactionRoutes from './routes/transactions.js';
import budgetRoutes      from './routes/budgets.js';
import recurringRoutes   from './routes/recurring.js';
import analyticsRoutes   from './routes/analytics.js';
import adminRoutes       from './routes/admin.js';

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Database ──────────────────────────────────────────────────────────────────
await connectDB();

// ── Global middleware ─────────────────────────────────────────────────────────
app.use(cors({
  origin:      [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Auth rate limiter
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { status: 429, error: 'Too Many Requests', message: 'Too many requests, try again later' },
}));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/users/me',     userRoutes);
app.use('/api/categories',   categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets',      budgetRoutes);
app.use('/api/recurring',    recurringRoutes);
app.use('/api/analytics',    analyticsRoutes);
app.use('/api/admin',        adminRoutes);

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// 404
app.use((req, res) => res.status(404).json({ status: 404, error: 'Not Found', message: `Route ${req.path} not found` }));

// Error handler (must be last)
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  startScheduler();
});
