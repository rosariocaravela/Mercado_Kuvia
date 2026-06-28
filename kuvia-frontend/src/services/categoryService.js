import api from './api';

let cache = null;

export const categoryService = {
  getCategories: async () => {
    if (cache) return cache;
    
    try {
      const response = await api.get('/categories');
      const categories = response.data?.data || response.data || [];
      cache = categories;
      return cache;
    } catch (error) {
      console.warn('⚠️ Erro ao carregar categorias:', error);
      return [];
    }
  }
};