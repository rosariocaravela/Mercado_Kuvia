const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sellerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'sellers',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O nome da loja é obrigatório' }
    }
  },
  slug: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: { msg: 'Esta URL já está em uso' },
    validate: {
      is: {
        args: /^[a-z0-9-]+$/,
        msg: 'A URL só pode conter letras minúsculas, números e hífens'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  banner: {
    type: DataTypes.STRING,
    allowNull: true
  },
  primaryColor: {
    type: DataTypes.STRING(7),
    defaultValue: '#0050cb'
  },
  secondaryColor: {
    type: DataTypes.STRING(7),
    defaultValue: '#006c49'
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  province: {
    type: DataTypes.STRING(100),
    defaultValue: 'Maputo'
  },
  coordinates: {
    type: DataTypes.JSONB,
    allowNull: true
    // { lat: -25.9692, lng: 32.5732 }
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  followers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalProducts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'stores',
  timestamps: true,
  hooks: {
    beforeCreate: (store) => {
      // Gerar slug automático se não fornecido
      if (!store.slug && store.name) {
        store.slug = store.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    }
  }
});

module.exports = Store;