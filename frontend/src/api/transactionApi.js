import api from './axiosInstance';
export const transactionApi = {
  getAll:    (params)    => api.get('/transactions', { params }),
  getRecent: ()          => api.get('/transactions/recent'),
  getById:   (id)        => api.get(`/transactions/${id}`),
  create:    (data)      => api.post('/transactions', data),
  update:    (id, data)  => api.put(`/transactions/${id}`, data),
  delete:    (id)        => api.delete(`/transactions/${id}`),
};
