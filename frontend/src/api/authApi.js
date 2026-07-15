import api from './axiosInstance';
export const authApi = {
  signUp:             (data)  => api.post('/auth/signup', data),
  signIn:             (data)  => api.post('/auth/signin', data),
  verifyEmail:        (token) => api.get(`/auth/verify-email?token=${token}`),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  forgotPassword:     (data)  => api.post('/auth/forgot-password', data),
  resetPassword:      (data)  => api.post('/auth/reset-password', data),
  getProfile:         ()      => api.get('/users/me'),
  updateProfile:      (data)  => api.put('/users/me', data),
  changePassword:     (data)  => api.put('/users/me/password', data),
};
