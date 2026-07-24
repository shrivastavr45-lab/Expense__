import api from './axiosInstance';
export const authApi = {
  signUp:        (data) => api.post('/auth/signup', data),
  signIn:        (data) => api.post('/auth/signin', data),
  getProfile:    ()     => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  changePassword:(data) => api.put('/users/me/password', data),
};
