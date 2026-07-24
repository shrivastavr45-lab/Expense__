import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../services/tokenService.js';
import { audit } from '../services/auditService.js';

const userResponse = (u) => ({
  id: u._id, username: u.username, email: u.email,
  firstName: u.firstName, lastName: u.lastName,
  roles: u.roles, enabled: u.enabled, emailVerified: u.emailVerified,
  currency: u.currency, createdAt: u.createdAt,
});

// ── signup ────────────────────────────────────────────────────────────────────
export const signup = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;

  if (await User.findOne({ email }))    throw Object.assign(new Error('Email already registered'), { status: 400 });
  if (await User.findOne({ username })) throw Object.assign(new Error('Username already taken'), { status: 400 });

  const user = await User.create({
    username, email, password, firstName, lastName,
    emailVerified: true, enabled: true,
  });
  await audit(user._id, user.email, 'SIGNUP', 'USER', user._id, null, null, req);

  res.status(201).json({ success: true, message: 'Account created.', user: userResponse(user) });
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


