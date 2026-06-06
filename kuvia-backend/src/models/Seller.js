const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Seller = sequelize.define('Seller', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  nuit: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      isNumeric: { msg: 'NUIT deve conter apenas números' },
      len: { args: [9, 13], msg: 'NUIT deve ter entre 9 e 13 dígitos' }
    }
  },
  businessName: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  businessType: {
    type: DataTypes.ENUM(
      'ELETRONICOS',
      'MODA',
      'BELEZA',
      'ALIMENTACAO',
      'AGRICULTURA',
      'MOVEIS',
      'SERVICOS',
      'OUTROS'
    ),
    allowNull: true
  },
  businessDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  whatsapp: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0.0,
    validate: {
      min: 0,
      max: 5
    }
  },
  totalSales: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalRevenue: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  mpesaNumber: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  bankDetails: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'sellers',
  timestamps: true
});

module.exports = Seller;