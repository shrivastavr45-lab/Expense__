import transporter from '../config/email.js';

const base = (title, color, body) => `
<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>body{margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;}
.wrap{max-width:580px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);}
.head{background:${color};padding:32px 40px;text-align:center;color:#fff;font-size:24px;font-weight:700;}
.body{padding:36px 40px;color:#555;font-size:15px;line-height:1.7;}
.btn{display:inline-block;background:${color};color:#fff;text-decoration:none;padding:13px 32px;border-radius:8px;font-size:15px;font-weight:600;margin:20px 0;}
.foot{background:#f8f9fa;padding:18px 40px;text-align:center;color:#aaa;font-size:12px;border-top:1px solid #eee;}
</style></head><body>
<div class="wrap">
  <div class="head">${title}</div>
  <div class="body">${body}</div>
  <div class="foot">© ${new Date().getFullYear()} Expense Tracker. All rights reserved.</div>
</div></body></html>`;

export const sendVerificationEmail = async (user, token) => {
  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from:    process.env.MAIL_FROM,
    to:      user.email,
    subject: 'Verify your email address',
    html: base('💰 Expense Tracker', 'linear-gradient(135deg,#6366f1,#8b5cf6)', `
      <p>Hi <strong>${user.username}</strong>,</p>
      <p>Thanks for signing up! Click the button below to verify your email and activate your account.</p>
      <div style="text-align:center"><a class="btn" href="${url}">Verify Email Address</a></div>
      <p style="color:#888;font-size:13px">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
      <p style="color:#aaa;font-size:12px;word-break:break-all">Or paste: ${url}</p>
    `),
  });
};

export const sendPasswordResetEmail = async (user, token) => {
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from:    process.env.MAIL_FROM,
    to:      user.email,
    subject: 'Reset your password',
    html: base('🔐 Password Reset', 'linear-gradient(135deg,#f59e0b,#ef4444)', `
      <p>Hi <strong>${user.username}</strong>,</p>
      <p>We received a request to reset your password. Click below to set a new one.</p>
      <div style="text-align:center"><a class="btn" href="${url}" style="background:#ef4444">Reset Password</a></div>
      <p style="color:#888;font-size:13px">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
    `),
  });
};

export const sendBudgetAlertEmail = async (user, budget) => {
  await transporter.sendMail({
    from:    process.env.MAIL_FROM,
    to:      user.email,
    subject: `Budget Alert — ${budget.categoryName}`,
    html: base('⚠️ Budget Alert', 'linear-gradient(135deg,#f97316,#ef4444)', `
      <p>Hi <strong>${user.username}</strong>,</p>
      <p>Your <strong>${budget.categoryName}</strong> budget has reached
         <strong>${budget.usagePercentage.toFixed(1)}%</strong> of its limit.</p>
      <div style="background:#fff8f0;border:1px solid #fed7aa;border-radius:8px;padding:20px;margin:20px 0">
        <p style="margin:4px 0">Spent: <strong style="color:#ef4444">${user.currency} ${parseFloat(budget.spentAmount).toFixed(2)}</strong></p>
        <p style="margin:4px 0">Limit: <strong>${user.currency} ${parseFloat(budget.limitAmount).toFixed(2)}</strong></p>
        <div style="background:#e5e7eb;border-radius:4px;height:8px;margin-top:12px">
          <div style="background:#ef4444;width:${Math.min(budget.usagePercentage,100).toFixed(0)}%;height:8px;border-radius:4px"></div>
        </div>
      </div>
      <div style="text-align:center">
        <a class="btn" href="${process.env.FRONTEND_URL}/budgets" style="background:#6366f1">View Budgets</a>
      </div>
    `),
  });
};
