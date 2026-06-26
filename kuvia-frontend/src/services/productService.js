import api from './api';

export const productService = {
  /**
   * Listar produtos da loja do vendedor
   */
  getMyProducts: async (params = {}) => {
    const response = await api.get('/seller/products', { params });
    return response.data;
  },

  /**
   * Criar novo produto
   */
  createProduct: async (formData) => {
    const response = await api.post('/seller/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  /**
   * Obter produto por ID
   */
  getProductById: async (id) => {
    const response = await api.get(`/seller/products/${id}`);
    return response.data;
  },

  /**
   * Actualizar produto
   */
  updateProduct: async (id, formData) => {
    const response = await api.put(`/seller/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  /**
   * Eliminar produto
   */
  deleteProduct: async (id) => {
    const response = await api.delete(`/seller/products/${id}`);
    return response.data;
  },

  /**
   * Activar/Desactivar produto
   */
  toggleProductStatus: async (id, isActive) => {
    const response = await api.patch(`/seller/products/${id}/status`, { isActive });
    return response.data;
  }
};