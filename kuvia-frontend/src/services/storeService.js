import api from './api';

export const storeService = {
  /**
   * Criar nova loja com upload de imagens
   */
  createStore: async (formData) => {
    const response = await api.post('/stores', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
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
   * Obter categorias disponíveis
   */
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  /**
   * Atualizar loja existente
   */
  updateStore: async (storeId, data) => {
    const response = await api.put(`/stores/${storeId}`, data);
    return response.data;
  },

  /**
   * Obter dados da loja do vendedor atual
   */
  getMyStore: async () => {
    const response = await api.get('/stores/my-store');
    return response.data;
  }
};