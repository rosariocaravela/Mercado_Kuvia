import api from './api';

export const storeService = {
  /**
   * Criar nova loja
   */
  createStore: async (formData) => {
    const response = await api.post('/stores', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  /**
   * Obter loja por slug (pública)
   */
  getStoreBySlug: async (slug) => {
    const response = await api.get(`/stores/${slug}`);
    return response.data;
  },

  /**
   * Obter produtos da loja (pública)
   */
  getStoreProducts: async (slug, params = {}) => {
    const response = await api.get(`/stores/${slug}/products`, { params });
    return response.data;
  },

  /**
   * Pesquisar lojas (pública)
   */
  searchStores: async (params = {}) => {
    const response = await api.get('/stores', { params });
    return response.data;
  },

  /**
   * Verificar disponibilidade de slug
   */
  checkSlug: async (slug) => {
    const response = await api.get(`/stores/check-slug?slug=${slug}`);
    return response.data;
  },

  /**
   * Obter loja do vendedor actual
   */
  getMyStore: async () => {
    const response = await api.get('/stores/my-store');
    return response.data;
  },

  /**
   * Actualizar loja
   */
  updateStore: async (storeId, data) => {
    const response = await api.put(`/stores/${storeId}`, data);
    return response.data;
  },
};

export default storeService;