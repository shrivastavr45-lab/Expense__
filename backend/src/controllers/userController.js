import User from '../models/User.js';

export const getMe = (req, res) => {
  const u = req.user;
  res.json({
    id: u._id, username: u.username, email: u.email,
    firstName: u.firstName, lastName: u.lastName,
    roles: u.roles, enabled: u.enabled, emailVerified: u.emailVerified,
    currency: u.currency, profilePictureUrl: u.profilePictureUrl, createdAt: u.createdAt,
  });
};

export const updateProfile = async (req, res) => {
  const { firstName, lastName, currency } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id, { firstName, lastName, currency }, { new: true, runValidators: true }
  );
  res.json({ id: user._id, username: user.username, email: user.email,
    firstName: user.firstName, lastName: user.lastName, currency: user.currency });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword)))
    throw Object.assign(new Error('Current password is incorrect'), { status: 400 });
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password changed successfully' });
};
