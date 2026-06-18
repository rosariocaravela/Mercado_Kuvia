const dashboardService = require('../services/dashboardService');

/**
 * GET /api/seller/dashboard
 * Retorna todos os dados do dashboard do vendedor
 */
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const data = await dashboardService.getDashboardData(userId);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Erro ao carregar dashboard:', error);
    
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar dados do dashboard'
    });
  }
};

/**
 * GET /api/seller/dashboard/stats
 * Retorna apenas estatísticas (para refresh rápido)
 */
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const Seller = require('../models/Seller');
    const Store = require('../models/Store');
    
    const seller = await Seller.findOne({ where: { userId } });
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Vendedor não encontrado' });
    }
    
    const store = await Store.findOne({ where: { sellerId: seller.id } });
    if (!store) {
      return res.status(404).json({ success: false, message: 'Loja não encontrada' });
    }
    
    const stats = await dashboardService.getStoreStats(store.id);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Erro ao carregar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar estatísticas'
    });
  }
};

/**
 * GET /api/seller/dashboard/sales-trend
 * Retorna dados de vendas para o gráfico
 */
exports.getSalesTrend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 7 } = req.query;
    
    const Seller = require('../models/Seller');
    const Store = require('../models/Store');
    
    const seller = await Seller.findOne({ where: { userId } });
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Vendedor não encontrado' });
    }
    
    const store = await Store.findOne({ where: { sellerId: seller.id } });
    if (!store) {
      return res.status(404).json({ success: false, message: 'Loja não encontrada' });
    }
    
    const salesData = await dashboardService.getSalesTrend(store.id, parseInt(days));
    
    res.json({
      success: true,
      data: salesData
    });
  } catch (error) {
    console.error('❌ Erro ao carregar tendência de vendas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar dados de vendas'
    });
  }
};

/**
 * GET /api/seller/dashboard/activity
 * Retorna atividades recentes
 */
exports.getActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;
    
    const Seller = require('../models/Seller');
    const Store = require('../models/Store');
    
    const seller = await Seller.findOne({ where: { userId } });
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Vendedor não encontrado' });
    }
    
    const store = await Store.findOne({ where: { sellerId: seller.id } });
    if (!store) {
      return res.status(404).json({ success: false, message: 'Loja não encontrada' });
    }
    
    const activities = await dashboardService.getRecentActivities(store.id, parseInt(limit));
    
    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('❌ Erro ao carregar atividades:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar atividades'
    });
  }
};
