const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


console.log('SEQUELIZE:', sequelize);
const Seller = require('./Seller');

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
      is: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, // Apenas letras minúsculas, números e hífens
      notEmpty: true 
    },
    set(val) { 
      // Garantir que o slug é sempre guardado em minúsculas
      this.setDataValue('slug', val?.toLowerCase()); 
    }
  },
  description: { 
    type: DataTypes.TEXT,
    validate: { len: [0, 500] }
  },
  whatsapp_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: { 
      is: /^(\+258)?[8][2-467]\d{7}$/, // Formato Moçambique: +258 8X XXX XXXX
      notEmpty: true 
    }
  },
  logo_url: { 
    type: DataTypes.STRING(500),
    validate: { isUrl: true }
  },
  banner_url: { 
    type: DataTypes.STRING(500),
    validate: { isUrl: true }
  },
  theme_config: {
    type: DataTypes.JSONB,
    defaultValue: { 
      primaryColor: '#0050cb', 
      secondaryColor: '#006c49',
      fontFamily: 'Inter'
    }
  },
  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false,
    comment: 'Loja só fica pública quando activa e aprovada'
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED'),
    defaultValue: 'PENDING',
    comment: 'Fluxo de aprovação: PENDING → APPROVED (por admin)'
  }
}, {
  tableName: 'stores',
  timestamps: true,
  underscored: true,
  indexes: [
    { unique: true, fields: ['slug'] },
    { fields: ['owner_id'] },
    { fields: ['is_active', 'status'] },
    { fields: ['createdAt'] }
  ]
});

// Relações com Seller (1:1)
Store.belongsTo(Seller, { 
  foreignKey: 'owner_id', 
  as: 'owner', 
  onDelete: 'CASCADE',
  constraints: true 
});
Seller.hasOne(Store, { 
  foreignKey: 'owner_id', 
  as: 'store',
  constraints: true 
});

module.exports = Store;