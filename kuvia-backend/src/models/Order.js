const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'clients',
      key: 'id'
    }
  },
  storeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'stores',
      key: 'id'
    }
  },
  sellerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'sellers',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM(
      'PENDING',
      'CONFIRMED',
      'PREPARING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
      'REFUNDED'
    ),
    defaultValue: 'PENDING'
  },
  paymentMethod: {
    type: DataTypes.ENUM('MPESA', 'EMOLA', 'BANK_TRANSFER', 'CASH', 'OTHER'),
    allowNull: true
  },
  paymentStatus: {
    type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED'),
    defaultValue: 'PENDING'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  deliveryFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'MZN'
  },
  deliveryAddress: {
    type: DataTypes.JSONB,
    allowNull: true
    // { street, city, province, neighborhood, reference }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  whatsappContact: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  estimatedDelivery: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelReason: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
  hooks: {
    beforeCreate: (order) => {
      if (!order.orderNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        order.orderNumber = `KV${year}${month}${random}`;
      }
    }
  }
});

module.exports = Order;