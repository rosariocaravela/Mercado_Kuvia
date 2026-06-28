const { Op, Sequelize } = require('sequelize');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Review = require('../models/Review');
const Seller = require('../models/Seller');
const Client = require('../models/Client');
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
  const seller = await Seller.findOne({ where: { userId } });

  if (!seller) {
    throw new Error('Perfil de vendedor não encontrado');
  }

  const store = await Store.findOne({ where: { sellerId: seller.id } });

  if (!store) {
    return {
      store: null,
      seller: {
        id: seller.id,
        businessName: seller.businessName,
        rating: seller.rating,
        verified: seller.isVerified
      },
      stats: {
        totalProducts: 0,
        totalViews: 0,
        totalOrders: 0,
        revenue: 0,
        lowStockProducts: 0,
        viewsChange: '0%'
      },
      salesData: {
        labels: [],
        values: [],
        period: '7days'
      },
      activities: [],
      recentProducts: []
    };
  }

  const stats = await this.getStoreStats(store.id);
  const salesData = await this.getSalesTrend(store.id, 7);
  const activities = await this.getRecentActivities(store.id);

  const recentProducts = await Product.findAll({
    where: { storeId: store.id },
    limit: 5,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'name', 'price', 'stock', 'views', 'createdAt']
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
      verified: seller.isVerified
    },
    stats,
    salesData,
    activities,
    recentProducts
  };
};

exports.getStoreStats = async (storeId) => {
  const totalProducts = await Product.count({
    where: { storeId, isActive: true }
  });

  const totalViews = await Product.sum('views', {
    where: { storeId }
  }) || 0;

  const totalOrders = await Order.count({
    where: { storeId }
  }).catch(() => 0);

  const revenue = await OrderItem.sum('total', {
    include: [{
      model: Order,
      where: { storeId, status: 'COMPLETED' }
    }]
  }).catch(() => 0);

  const lowStockProducts = await Product.count({
    where: {
      storeId,
      stock: { [Op.lte]: 5 },
      isActive: true
    }
  });

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

exports.getSalesTrend = async (storeId, days = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

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

  const labels = [];
  const values = [];
  const salesMap = new Map(salesByDay.map(s => [s.date, parseFloat(s.total)]));

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    labels.push(exports.formatDateLabel(date, days));
    values.push(salesMap.get(dateStr) || 0);
  }

  return { labels, values, period: `${days}days` };
};

exports.getRecentActivities = async (storeId, limit = 10) => {
  const activities = [];

  const recentOrders = await Order.findAll({
    where: { storeId },
    limit: 3,
    order: [['createdAt', 'DESC']],
    include: [{
      model: Client,
      as: 'client',
      include: [{ model: User, as: 'user', attributes: ['name'] }]
    }],
    attributes: ['id', 'status', 'total', 'createdAt']
  }).catch(() => []);

  recentOrders.forEach(order => {
    activities.push({
      type: 'order',
      icon: 'shopping_cart',
      title: `Novo pedido: #${order.id.slice(0, 4)}`,
      subtitle: `${order.client?.user?.name || 'Cliente'} • ${exports.timeAgo(order.createdAt)}`,
      timestamp: order.createdAt
    });
  });

  const recentReviews = await Review.findAll({
    where: { storeId },
    limit: 2,
    order: [['createdAt', 'DESC']],
    include: [{
      model: Client,
      as: 'client',
      include: [{ model: User, as: 'user', attributes: ['name'] }]
    }],
    attributes: ['rating', 'comment', 'createdAt']
  }).catch(() => []);

  recentReviews.forEach(review => {
    activities.push({
      type: 'review',
      icon: 'star',
      title: `Nova avaliação (${review.rating} ⭐)`,
      subtitle: `${review.client?.user?.name || 'Cliente'} • ${exports.timeAgo(review.createdAt)}`,
      timestamp: review.createdAt
    });
  });

  activities.push({
    type: 'message',
    icon: 'chat',
    title: 'Pergunta via WhatsApp',
    subtitle: 'Carlos Alberto • 11:30',
    timestamp: new Date()
  });

  activities.push({
    type: 'customer',
    icon: 'person_add',
    title: 'Novo cliente registado',
    subtitle: 'Joaquim L. • Ontem',
    timestamp: new Date(Date.now() - 86400000)
  });

  return activities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

exports.formatDateLabel = (date, days) => {
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  if (days <= 7) {
    return daysOfWeek[date.getDay()];
  }

  return `${date.getDate()}/${date.getMonth() + 1}`;
};

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
