import api from './axiosInstance';
export const recurringApi = {
  getAll:  ()         => api.get('/recurring'),
  create:  (data)     => api.post('/recurring', data),
  update:  (id, data) => api.put(`/recurring/${id}`, data),
  toggle:  (id)       => api.patch(`/recurring/${id}/toggle`),
  delete:  (id)       => api.delete(`/recurring/${id}`),
};
