import api from './axiosInstance';
export const analyticsApi = {
  getSummary:      (from, to) => api.get('/analytics/summary', { params: { from, to } }),
  getCurrentMonth: ()         => api.get('/analytics/current-month'),
  getLast12Months: ()         => api.get('/analytics/last-12-months'),
};
