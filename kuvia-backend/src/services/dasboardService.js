const { Op, Sequelize } = require('sequelize');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Review = require('../models/Review');
const Seller = require('../models/Seller');
const User = require('../models/User');

/**
 * Serviço do Dashboard do Vendedor
 * Fornece todos os dados necessários para o SellerDashboard
 */

/**
 * Obter dados completos do dashboard para um vendedor
 * @param {string} userId - ID do utilizador autenticado
 * @returns {Object} Dados do dashboard
 */
exports.getDashboardData = async (userId) => {
  // 1. Obter seller e loja
  const seller = await Seller.findOne({ where: { userId } });
  
  if (!seller) {
    throw new Error('Perfil de vendedor não encontrado');
  }

  const store = await Store.findOne({ where: { owner_id: seller.id } });
  
  if (!store) {
    throw new Error('Loja não encontrada. Crie uma loja primeiro.');
  }

  // 2. Obter estatísticas (KPIs)
  const stats = await this.getStoreStats(store.id);

  // 3. Obter dados de vendas para o gráfico
  const salesData = await this.getSalesTrend(store.id, 7);

  // 4. Obter atividades recentes
  const activities = await this.getRecentActivities(store.id);

  // 5. Obter produtos recentes
  const recentProducts = await Product.findAll({
    where: { storeId: store.id },
    limit: 5,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'title', 'price', 'stock', 'views', 'createdAt']
  });

  return {
    store: {
      id: store.id,
      name: store.name,
      slug: store.slug,
      status: store.status,
      is_active: store.is_active,
      logo_url: store.logo_url,
      banner_url: store.banner_url,
      whatsapp_number: store.whatsapp_number
    },
    seller: {
      id: seller.id,
      businessName: seller.businessName,
      rating: seller.rating,
      verified: seller.verified
    },
    stats,
    salesData,
    activities,
    recentProducts
  };
};

/**
 * Obter estatísticas da loja (KPIs)
 */
exports.getStoreStats = async (storeId) => {
  // Total de produtos
  const totalProducts = await Product.count({
    where: { storeId, is_active: true }
  });

  // Total de visualizações (soma de views de todos os produtos)
  const totalViews = await Product.sum('views', {
    where: { storeId }
  }) || 0;

  // Total de pedidos (via WhatsApp - simulado por agora)
  // Quando tivermos o modelo de pedidos, usar Order.count
  const totalOrders = await Order.count({
    where: { storeId }
  }).catch(() => 0); // Retorna 0 se tabela não existir

  // Receita estimada (soma de preços * quantidade dos pedidos)
  const revenue = await OrderItem.sum('total', {
    include: [{
      model: Order,
      where: { storeId, status: 'COMPLETED' }
    }]
  }).catch(() => 0);

  // Produtos com stock baixo
  const lowStockProducts = await Product.count({
    where: {
      storeId,
      stock: { [Op.lte]: 5 },
      is_active: true
    }
  });

  // Variação percentual (comparar com período anterior)
  const previousPeriod = new Date();
  previousPeriod.setDate(previousPeriod.getDate() - 7);

  const previousViews = await Product.sum('views', {
    where: {
      storeId,
      createdAt: { [Op.lt]: previousPeriod }
    }
  }) || 0;

  const viewsChange = previousViews > 0 
    ? Math.round(((totalViews - previousViews) / previousViews) * 100)
    : 0;

  return {
    totalProducts,
    totalViews,
    totalOrders,
    revenue: revenue || 0,
    lowStockProducts,
    viewsChange: `${viewsChange > 0 ? '+' : ''}${viewsChange}%`
  };
};

/**
 * Obter tendência de vendas (gráfico)
 * @param {string} storeId - ID da loja
 * @param {number} days - Número de dias (7 ou 30)
 */
exports.getSalesTrend = async (storeId, days = 7) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Agrupar pedidos por dia
  const salesByDay = await Order.findAll({
    where: {
      storeId,
      createdAt: { [Op.gte]: startDate }
    },
    attributes: [
      [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
      [Sequelize.fn('SUM', Sequelize.col('total')), 'total']
    ],
    group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
    order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']],
    raw: true
  }).catch(() => []);

  // Gerar array completo de dias (preencher dias sem vendas)
  const labels = [];
  const values = [];
  const salesMap = new Map(salesByDay.map(s => [s.date, parseFloat(s.total)]));

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    labels.push(this.formatDateLabel(date, days));
    values.push(salesMap.get(dateStr) || 0);
  }

  return { labels, values, period: `${days}days` };
};

/**
 * Obter atividades recentes
 */
exports.getRecentActivities = async (storeId, limit = 10) => {
  const activities = [];

  // 1. Pedidos recentes
  const recentOrders = await Order.findAll({
    where: { storeId },
    limit: 3,
    order: [['createdAt', 'DESC']],
    include: [{
      model: User,
      as: 'customer',
      attributes: ['fullName']
    }],
    attributes: ['id', 'status', 'total', 'createdAt']
  }).catch(() => []);

  recentOrders.forEach(order => {
    activities.push({
      type: 'order',
      icon: 'shopping_cart',
      title: `Novo pedido: #${order.id.slice(0, 4)}`,
      subtitle: `${order.customer?.fullName || 'Cliente'} • ${this.timeAgo(order.createdAt)}`,
      timestamp: order.createdAt
    });
  });

  // 2. Avaliações recentes
  const recentReviews = await Review.findAll({
    where: { storeId },
    limit: 2,
    order: [['createdAt', 'DESC']],
    include: [{
      model: User,
      as: 'customer',
      attributes: ['fullName']
    }],
    attributes: ['rating', 'comment', 'createdAt']
  }).catch(() => []);

  recentReviews.forEach(review => {
    activities.push({
      type: 'review',
      icon: 'star',
      title: `Nova avaliação (${review.rating} ⭐)`,
      subtitle: `${review.customer?.fullName || 'Cliente'} • ${this.timeAgo(review.createdAt)}`,
      timestamp: review.createdAt
    });
  });

  // 3. Perguntas via WhatsApp (simulado - quando tivermos modelo de mensagens)
  // Por agora, mockado para demonstração
  activities.push({
    type: 'message',
    icon: 'chat',
    title: 'Pergunta via WhatsApp',
    subtitle: 'Carlos Alberto • 11:30',
    timestamp: new Date()
  });

  // 4. Novos clientes (simulado)
  activities.push({
    type: 'customer',
    icon: 'person_add',
    title: 'Novo cliente registado',
    subtitle: 'Joaquim L. • Ontem',
    timestamp: new Date(Date.now() - 86400000)
  });

  // Ordenar por timestamp e limitar
  return activities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

/**
 * Helper: Formatar label de data
 */
exports.formatDateLabel = (date, days) => {
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  if (days <= 7) {
    return daysOfWeek[date.getDay()];
  }
  
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

/**
 * Helper: Tempo relativo (ex: "há 2 horas")
 */
exports.timeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  const intervals = [
    { label: 'ano', seconds: 31536000 },
    { label: 'mês', seconds: 2592000 },
    { label: 'semana', seconds: 604800 },
    { label: 'dia', seconds: 86400 },
    { label: 'hora', seconds: 3600 },
    { label: 'minuto', seconds: 60 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} atrás`;
    }
  }
  
  return 'agora mesmo';
};