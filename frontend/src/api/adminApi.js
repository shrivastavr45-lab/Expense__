import api from './axiosInstance';
export const adminApi = {
  getUsers:        (params) => api.get('/admin/users', { params }),
  getUser:         (id)     => api.get(`/admin/users/${id}`),
  toggleUser:      (id)     => api.patch(`/admin/users/${id}/toggle`),
  getTransactions: (params) => api.get('/admin/transactions', { params }),
  getAuditLogs:    (params) => api.get('/admin/audit', { params }),
};
