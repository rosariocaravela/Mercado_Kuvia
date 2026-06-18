import api from './api';

export const storeService = {
  createStore: async (formData) => {
    const response = await api.post('/stores', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data;
  },
  
  getStoreBySlug: async (slug) => {
    const response = await api.get(`/stores/${slug}`);
    return response.data;
  },
  
  getStoreProducts: async (slug, params = {}) => {
    const response = await api.get(`/stores/${slug}/products`, { params });
    return response.data;
  },
  
  searchStores: async (params = {}) => {
    const response = await api.get('/stores', { params });
    return response.data;
  },
  
  checkSlug: async (slug) => {
    const response = await api.get(`/stores/check-slug?slug=${slug}`);
    return response.data;
  }
};