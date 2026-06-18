import api from './api';

/**
 * Serviço de API para o Dashboard do Vendedor
 */
export const dashboardService = {
  /**
   * Obter todos os dados do dashboard
   */
  getDashboardData: async () => {
    const response = await api.get('/seller/dashboard');
    return response.data;
  },

  /**
   * Obter apenas estatísticas (KPIs)
   */
  getStats: async () => {
    const response = await api.get('/seller/dashboard/stats');
    return response.data;
  },

  /**
   * Obter tendência de vendas
   * @param {number} days - Número de dias (7 ou 30)
   */
  getSalesTrend: async (days = 7) => {
    const response = await api.get('/seller/dashboard/sales-trend', {
      params: { days }
    });
    return response.data;
  },

  /**
   * Obter atividades recentes
   * @param {number} limit - Número máximo de atividades
   */
  getActivity: async (limit = 10) => {
    const response = await api.get('/seller/dashboard/activity', {
      params: { limit }
    });
    return response.data;
  },
};

export default dashboardService;