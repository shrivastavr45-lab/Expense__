import api from './axiosInstance';
export const budgetApi = {
  getActive: ()         => api.get('/budgets'),
  getAll:    ()         => api.get('/budgets/all'),
  create:    (data)     => api.post('/budgets', data),
  update:    (id, data) => api.put(`/budgets/${id}`, data),
  delete:    (id)       => api.delete(`/budgets/${id}`),
};
