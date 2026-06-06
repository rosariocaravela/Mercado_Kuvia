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
    allowNull: false,
    references: {
      model: 'stores',
      key: 'id'
    },
    onDelete: 'CASCADE'
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
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O nome do produto é obrigatório' }
    }
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
    allowNull: false,
    validate: {
      min: 0
    }
  },
  comparePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
    // Preço original (para mostrar desconto)
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
    // Preço de custo (interno)
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  sku: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
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
    defaultValue: 0.0
  }
}, {
  tableName: 'products',
  timestamps: true,
  hooks: {
    beforeCreate: (product) => {
      if (!product.slug && product.name) {
        product.slug = product.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') + '-' + Date.now().toString(36);
      }
    }
  }
});

module.exports = Product;