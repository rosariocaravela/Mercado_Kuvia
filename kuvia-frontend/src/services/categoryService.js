import api from './api';

const FALLBACK_CATEGORIES = [
  { id: 'electronics', slug: 'electronics', name: 'Electrónica', icon: 'devices' },
  { id: 'fashion', slug: 'fashion', name: 'Moda & Vestuário', icon: 'apparel' },
  { id: 'home', slug: 'home', name: 'Casa & Decoração', icon: 'chair' },
  { id: 'beauty', slug: 'beauty', name: 'Saúde & Beleza', icon: 'spa' },
  { id: 'food', slug: 'food', name: 'Alimentação', icon: 'restaurant' },
  { id: 'services', slug: 'services', name: 'Serviços', icon: 'handyman' },
  { id: 'kids', slug: 'kids', name: 'Kids & Brinquedos', icon: 'toys' },
  { id: 'sports', slug: 'sports', name: 'Desporto & Lazer', icon: 'sports_soccer' },
  { id: 'books', slug: 'books', name: 'Livros & Papelaria', icon: 'menu_book' },
  { id: 'automotive', slug: 'automotive', name: 'Automóveis', icon: 'directions_car' },
  { id: 'other', slug: 'other', name: 'Outros', icon: 'category' }
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