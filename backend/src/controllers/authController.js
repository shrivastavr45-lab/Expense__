import crypto from 'crypto';
import User from '../models/User.js';
import Token from '../models/Token.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../services/tokenService.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';
import { audit } from '../services/auditService.js';

// ── helpers ──────────────────────────────────────────────────────────────────
const userResponse = (u) => ({
  id: u._id, username: u.username, email: u.email,
  firstName: u.firstName, lastName: u.lastName,
  roles: u.roles, enabled: u.enabled, emailVerified: u.emailVerified,
  currency: u.currency, createdAt: u.createdAt,
});

const makeToken = async (userId, type, expiryHours) => {
  await Token.deleteMany({ userId, type });
  const token = crypto.randomUUID();
  await Token.create({
    userId, token, type,
    expiresAt: new Date(Date.now() + expiryHours * 3600 * 1000),
  });
  return token;
};

// ── signup ────────────────────────────────────────────────────────────────────
export const signup = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;

  if (await User.findOne({ email }))    throw Object.assign(new Error('Email already registered'), { status: 400 });
  if (await User.findOne({ username })) throw Object.assign(new Error('Username already taken'), { status: 400 });

  const user = await User.create({ username, email, password, firstName, lastName });
  const token = await makeToken(user._id, 'EMAIL_VERIFY', parseInt(process.env.EMAIL_VERIFY_EXPIRY_HOURS || 24));
  sendVerificationEmail(user, token).catch(console.error);
  await audit(user._id, user.email, 'SIGNUP', 'USER', user._id, null, null, req);

  res.status(201).json({ success: true, message: 'Account created. Check your email to verify.', user: userResponse(user) });
};

// ── verify email ──────────────────────────────────────────────────────────────
export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  const record = await Token.findOne({ token, type: 'EMAIL_VERIFY' });
  if (!record) throw Object.assign(new Error('Invalid verification token'), { status: 400 });
  if (record.used) throw Object.assign(new Error('Token already used'), { status: 400 });
  if (record.expiresAt < new Date()) throw Object.assign(new Error('Token expired'), { status: 401 });

  await User.findByIdAndUpdate(record.userId, { emailVerified: true, enabled: true });
  record.used = true;
  await record.save();
  await audit(record.userId, null, 'EMAIL_VERIFIED', 'USER', record.userId, null, null, req);
  res.json({ success: true, message: 'Email verified. You can now sign in.' });
};

// ── resend verification ───────────────────────────────────────────────────────
export const resendVerification = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw Object.assign(new Error('No account with that email'), { status: 404 });
  if (user.emailVerified) throw Object.assign(new Error('Email already verified'), { status: 400 });
  const token = await makeToken(user._id, 'EMAIL_VERIFY', parseInt(process.env.EMAIL_VERIFY_EXPIRY_HOURS || 24));
  sendVerificationEmail(user, token).catch(console.error);
  res.json({ success: true, message: 'Verification email sent' });
};

// ── signin ────────────────────────────────────────────────────────────────────
export const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password)))
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  if (!user.enabled)
    throw Object.assign(new Error('Please verify your email first'), { status: 401 });

  const accessToken  = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  await audit(user._id, user.email, 'LOGIN', 'USER', user._id, null, null, req);

  res.json({ accessToken, refreshToken, tokenType: 'Bearer', ...userResponse(user) });
};

// ── refresh token ─────────────────────────────────────────────────────────────
export const refreshToken = async (req, res) => {
  const token = req.headers['x-refresh-token'];
  if (!token) throw Object.assign(new Error('Refresh token required'), { status: 401 });
  try {
    const decoded = verifyRefreshToken(token);
    const user    = await User.findById(decoded.id);
    if (!user) throw new Error();
    res.json({ accessToken: generateAccessToken(user._id), refreshToken: token, ...userResponse(user) });
  } catch {
    throw Object.assign(new Error('Invalid or expired refresh token'), { status: 401 });
  }
};

// ── forgot password ───────────────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const token = await makeToken(user._id, 'PASSWORD_RESET', parseInt(process.env.RESET_TOKEN_EXPIRY_HOURS || 1));
    sendPasswordResetEmail(user, token).catch(console.error);
  }
  // Always succeed to prevent email enumeration
  res.json({ success: true, message: "If an account exists, a reset link has been sent." });
};

// ── reset password ────────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const record = await Token.findOne({ token, type: 'PASSWORD_RESET' });
  if (!record || record.used || record.expiresAt < new Date())
    throw Object.assign(new Error('Invalid or expired reset token'), { status: 400 });

  const user = await User.findById(record.userId);
  user.password = newPassword;
  await user.save();
  record.used = true;
  await record.save();
  await audit(user._id, user.email, 'PASSWORD_RESET', 'USER', user._id, null, null, req);
  res.json({ success: true, message: 'Password reset successfully.' });
};
