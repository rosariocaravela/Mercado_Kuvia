# 🛍️ Kuvia - Backend

Backend da plataforma Kuvia, construído com Node.js, Express.js e PostgreSQL.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **Sequelize** - ORM para banco de dados
- **JWT** - Autenticação baseada em tokens
- **bcryptjs** - Hash de senhas

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar em desenvolvimento
npm run dev

# Iniciar em produção
npm start
```

## 📁 Estrutura de Pastas

```
kuvia-backend/
├── src/
│   ├── app.js                      # Configuração principal da aplicação
│   ├── config/                     # Configurações globais
│   │   ├── cors.js                # Configuração de CORS
│   │   ├── database.js            # Configuração de banco de dados
│   │   └── jwt.js                 # Configuração de JWT
│   │
│   ├── controllers/                # Controladores (lógica de requisições)
│   │   ├── authController.js      # Autenticação
│   │   ├── messageController.js   # Mensagens
│   │   ├── orderController.js     # Pedidos
│   │   ├── productController.js   # Produtos
│   │   ├── storeController.js     # Lojas
│   │   └── userController.js      # Utilizadores
│   │
│   ├── database/                   # Migrações e seeders
│   │   ├── migrations/            # Migrações de banco de dados
│   │   │   └── 001-create-tables.js
│   │   └── seeders/               # Dados iniciais
│   │       └── 001-initial-data.js
│   │
│   ├── middlewares/                # Middlewares
│   │   ├── authMiddleware.js      # Verificação de autenticação
│   │   ├── errorMiddleware.js     # Tratamento de erros
│   │   ├── roleMiddleware.js      # Verificação de permissões
│   │   └── validationMiddleware.js# Validação de dados
│   │
│   ├── models/                     # Modelos Sequelize
│   │   ├── Category.js            # Categoria de produtos
│   │   ├── Client.js              # Cliente/Comprador
│   │   ├── Message.js             # Mensagens
│   │   ├── Order.js               # Pedidos
│   │   ├── OrderItem.js           # Items de pedido
│   │   ├── Product.js             # Produtos
│   │   ├── Review.js              # Reviews/Avaliações
│   │   ├── Seller.js              # Vendedor
│   │   ├── Store.js               # Loja
│   │   ├── User.js                # Utilizador (base)
│   │   └── index.js               # Importação de todos os modelos
│   │
│   ├── routes/                     # Rotas da API
│   │   ├── authRoutes.js          # Rotas de autenticação
│   │   ├── messageRoutes.js       # Rotas de mensagens
│   │   ├── orderRoutes.js         # Rotas de pedidos
│   │   ├── productRoutes.js       # Rotas de produtos
│   │   ├── storeRoutes.js         # Rotas de lojas
│   │   ├── userRoutes.js          # Rotas de utilizadores
│   │   └── index.js               # Agregação de rotas
│   │
│   ├── services/                   # Serviços (lógica de negócio)
│   │   ├── authService.js         # Serviço de autenticação
│   │   ├── messageService.js      # Serviço de mensagens
│   │   ├── orderService.js        # Serviço de pedidos
│   │   ├── productService.js      # Serviço de produtos
│   │   ├── storeService.js        # Serviço de lojas
│   │   └── userService.js         # Serviço de utilizadores
│   │
│   ├── uploads/                    # Arquivos enviados
│   │   ├── products/              # Imagens de produtos
│   │   └── stores/                # Imagens de lojas
│   │
│   ├── utils/                      # Utilitários
│   │   ├── jwt.js                 # Funções JWT
│   │   ├── password.js            # Funções de senha
│   │   ├── response.js            # Respostas padronizadas
│   │   └── validators.js          # Funções de validação
│   │
│   └── validators/                 # Validadores (schemas)
│       ├── authValidator.js       # Validação de autenticação
│       ├── orderValidator.js      # Validação de pedidos
│       ├── productValidator.js    # Validação de produtos
│       └── storeValidator.js      # Validação de lojas
│
├── package.json
├── README.md
└── .env                           # Variáveis de ambiente (não incluir no git)
```

## 🔑 Variáveis de Ambiente

Criar arquivo `.env` na raiz do backend:

```env
# Banco de dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kuvia
DB_USER=postgres
DB_PASSWORD=seu_password

# JWT
JWT_SECRET=sua_chave_secreta
JWT_EXPIRY=7d

# Servidor
PORT=3000
NODE_ENV=development

# Uploads
UPLOAD_DIR=./src/uploads
MAX_FILE_SIZE=5242880  # 5MB em bytes
```

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo utilizador
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Logout

### Utilizadores
- `GET /api/users/:id` - Obter perfil
- `PUT /api/users/:id` - Atualizar perfil
- `DELETE /api/users/:id` - Eliminar conta

### Lojas
- `POST /api/stores` - Criar loja
- `GET /api/stores` - Listar lojas
- `GET /api/stores/:slug` - Obter loja por slug
- `PUT /api/stores/:id` - Atualizar loja
- `DELETE /api/stores/:id` - Eliminar loja

### Produtos
- `POST /api/products` - Criar produto
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Obter produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Eliminar produto

### Pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders` - Listar pedidos
- `GET /api/orders/:id` - Obter pedido
- `PUT /api/orders/:id` - Atualizar status

### Mensagens
- `POST /api/messages` - Enviar mensagem
- `GET /api/messages` - Listar mensagens
- `GET /api/messages/:conversationId` - Obter conversa

## 🏗️ Arquitetura

A aplicação segue o padrão **MVC (Model-View-Controller)**:

- **Models** - Definem a estrutura dos dados
- **Controllers** - Recebem as requisições e chamam os serviços
- **Services** - Contêm a lógica de negócio
- **Routes** - Definem os endpoints da API
- **Middlewares** - Processam requisições antes de chegar aos controladores

## 🔐 Autenticação

A autenticação é feita através de **JWT (JSON Web Tokens)**:

1. Utilizador faz login com email e senha
2. Backend retorna um token JWT
3. Cliente envia o token em cada requisição no header `Authorization: Bearer <token>`
4. Backend valida o token antes de processar a requisição

## 📝 Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento (com nodemon)
npm run dev

# Rodar migrações
npm run migrate

# Rodar seeders
npm run seed
```

## 🐛 Resolução de Problemas

### Erro de conexão com banco de dados
- Verificar se PostgreSQL está a correr
- Verificar credenciais em `.env`
- Verificar se a base de dados existe

### Erro de token JWT
- Verificar se a chave `JWT_SECRET` está configurada
- Limpar cache do navegador
- Renovar token expirado

## 📞 Suporte

Para dúvidas ou problemas, contactar a equipa de desenvolvimento.
