# Expense Tracker — MERN Stack

## Tech Stack
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Nodemailer, node-cron
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Zustand, Axios

## Quick Start

### Prerequisites
- Node.js 18+, npm
- MongoDB 6+ (local or Atlas)

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env          # fill in your values
npm run seed                  # seeds admin user + 14 categories
npm run dev                   # starts on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev                   # starts on http://localhost:5173
```

## Default Login
- Email:    `admin@expensetracker.com`
- Password: `Admin@123`

## API Reference
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | — | Register |
| POST | /api/auth/signin | — | Login → tokens |
| GET  | /api/auth/verify-email?token= | — | Verify email |
| POST | /api/auth/forgot-password | — | Send reset email |
| POST | /api/auth/reset-password | — | Set new password |
| GET  | /api/users/me | User | Get profile |
| GET  | /api/categories | User | All categories |
| GET  | /api/transactions | User | Paginated + filtered |
| GET  | /api/transactions/recent | User | Last 5 |
| POST | /api/transactions | User | Create |
| GET  | /api/budgets | User | Active budgets |
| GET  | /api/analytics/current-month | User | Monthly summary |
| GET  | /api/analytics/last-12-months | User | 12-month analytics |
| GET  | /api/admin/users | Admin | All users |
| GET  | /api/admin/audit | Admin | Audit logs |

## MongoDB Collections
| Collection | Description |
|---|---|
| users | Accounts with embedded roles |
| categories | System + user categories |
| transactions | All income/expense records |
| budgets | Per-category budget limits |
| recurring_expenses | Scheduled auto-posts |
| tokens | Email verify + password reset (TTL indexed) |
| audit_logs | Full mutation audit trail |

## Environment Variables
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense_tracker
JWT_SECRET=your_secret_min_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=you@gmail.com
MAIL_PASS=your-app-password
MAIL_FROM="Expense Tracker <noreply@expensetracker.com>"
FRONTEND_URL=http://localhost:5173
EMAIL_VERIFY_EXPIRY_HOURS=24
RESET_TOKEN_EXPIRY_HOURS=1
```
# Expense_Trac
