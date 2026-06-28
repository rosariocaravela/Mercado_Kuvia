const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  storeId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  categoryId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },

  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },

  slug: {
    type: DataTypes.STRING(200),
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  shortDescription: {
    type: DataTypes.STRING(500),
    allowNull: true
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  comparePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  sku: {
    type: DataTypes.STRING(50),
    allowNull: true
  },

  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  deliveryAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  pickupAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  weight: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },

  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },

  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  totalSold: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0
  }
}, {
  tableName: 'products',
  timestamps: true
});

module.exports = Product;