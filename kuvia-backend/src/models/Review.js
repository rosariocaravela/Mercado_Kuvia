const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'clients',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  storeId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'stores',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  helpful: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'reviews',
  timestamps: true
});

module.exports = Review;