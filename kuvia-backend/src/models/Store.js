const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [3, 100],
      notEmpty: true
    }
  },

  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      is: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      notEmpty: true
    },
    set(value) {
      this.setDataValue('slug', value?.toLowerCase());
    }
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },

  whatsapp_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      is: /^(\+258)?[8][2-7]\d{7}$/,
      notEmpty: true
    }
  },

  logo_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },

  banner_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },

  theme_config: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      primaryColor: '#0050cb',
      secondaryColor: '#006c49',
      fontFamily: 'Inter'
    }
  },

  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED'),
    allowNull: false,
    defaultValue: 'PENDING'
  }
}, {
  tableName: 'stores',

  // 🔥 IMPORTANTE: tua tabela NÃO tem timestamps
  timestamps: false
});

module.exports = Store;