import api from './api';

export const getFoods = async (queryString = '') => {
  const response = await api.get(`/foods${queryString ? `?${queryString}` : ''}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};