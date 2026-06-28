import api from './api';

const FALLBACK_CATEGORIES = [
  { id: 'electronics', name: 'Electrónica', icon: 'devices' },
  { id: 'fashion', name: 'Moda & Vestuário', icon: 'apparel' },
  { id: 'home', name: 'Casa & Decoração', icon: 'chair' },
  { id: 'beauty', name: 'Saúde & Beleza', icon: 'spa' },
  { id: 'food', name: 'Alimentação', icon: 'restaurant' },
  { id: 'services', name: 'Serviços', icon: 'handyman' },
  { id: 'kids', name: 'Kids & Brinquedos', icon: 'toys' },
  { id: 'sports', name: 'Desporto & Lazer', icon: 'sports_soccer' },
  { id: 'books', name: 'Livros & Papelaria', icon: 'menu_book' },
  { id: 'automotive', name: 'Automóveis', icon: 'directions_car' },
  { id: 'other', name: 'Outros', icon: 'category' }
];

let cache = null;

export const categoryService = {
  getCategories: async () => {
    if (cache) return cache;
    
    try {
      const response = await api.get('/categories');
      const categories = response.data?.data || response.data || [];
      cache = categories.length > 0 ? categories : FALLBACK_CATEGORIES;
      return cache;
    } catch (error) {
      console.warn('⚠️ Erro ao carregar categorias, usando fallback');
      return FALLBACK_CATEGORIES;
    }
  }
};