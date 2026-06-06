const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O nome é obrigatório' },
      len: { args: [2, 100], msg: 'O nome deve ter entre 2 e 100 caracteres' }
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: { msg: 'Este email já está em uso' },
    validate: {
      isEmail: { msg: 'Email inválido' }
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: { msg: 'Este telefone já está em uso' },
    validate: {
      isPhone(value) {
        // Formato Moçambique: +258 84/85/86/87 XXXXXXX
        const phoneRegex = /^(\+258)?[8][4-7]\d{7}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
          throw new Error('Número de telefone inválido. Use: +258 84 1234567');
        }
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: { args: [6, 100], msg: 'A senha deve ter pelo menos 6 caracteres' }
    }
  },
  role: {
    type: DataTypes.ENUM('CLIENT', 'SELLER', 'ADMIN'),
    allowNull: false,
    defaultValue: 'CLIENT'
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    // Encriptar senha antes de criar
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    // Encriptar senha antes de atualizar (se mudou)
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Método para verificar senha
User.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Método para retornar dados públicos (sem senha)
User.prototype.toPublicJSON = function() {
  return {
    id: this.id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    avatar: this.avatar,
    isActive: this.isActive,
    createdAt: this.createdAt
  };
};

module.exports = User;