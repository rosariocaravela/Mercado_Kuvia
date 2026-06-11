# 🛍️ Kuvia - Plataforma de Criação de Lojas Online

Kuvia é uma plataforma SaaS que permite a pequenos negócios, empreendedores e vendedores independentes em Moçambique criarem a sua própria loja online com URL personalizado.

## 🎯 Visão do Produto

A Kuvia NÃO é um marketplace tradicional. É uma **Store Creation Platform (Store Builder)** onde utilizadores podem criar as suas próprias lojas online com marca, receber um URL único, adicionar produtos e partilhar as suas lojas com clientes.

### Exemplos de URLs:
- `kuvia.co.mz/antonio-electronics`
- `kuvia.co.mz/maria-fashion`
- `kuvia.co.mz/home-style`

## 👥 Tipos de Utilizadores

### 1. **Cliente (Comprador)**
- Descobre lojas e produtos locais
- Pesquisa produtos
- Contacta vendedores via WhatsApp
- Guarda favoritos
- Faz pedidos

### 2. **Vendedor (Dono de Loja)**
- Cria loja online personalizada
- Publica produtos
- Gere pedidos
- Recebe pagamentos via WhatsApp
- Analisa métricas da loja

### 3. **Administrador**
- Aprova lojas
- Gere utilizadores
- Modera conteúdo
- Vê analytics da plataforma

## 🛠️ Stack Tecnológica

### Backend
- **Node.js** + **Express.js** (servidor)
- **PostgreSQL** (banco de dados)
- **Sequelize** (ORM)
- **JWT** (autenticação)
- **bcryptjs** (encriptação de senhas)
- **CORS** (cross-origin)
- **dotenv** (variáveis de ambiente)
- **express-validator** (validação)
- **multer** (upload de ficheiros)

### Frontend
- **React 18** + **Vite** (framework)
- **React Router** (navegação)
- **Axios** (requisições HTTP)
- **Context API** (estado global)
- **Tailwind CSS** (estilização)
- **ESLint** (linting)

## 📁 Estrutura Completa do Projeto

```
KUVIA/
│
├── README.md                           # Este arquivo
│
├── kuvia-backend/                      # Backend da aplicação
│   ├── src/
│   │   ├── app.js                      # Configuração principal do Express
│   │   ├── config/                     # Configurações da aplicação
│   │   │   ├── cors.js                # Configuração CORS
│   │   │   ├── database.js            # Conexão com BD
│   │   │   └── jwt.js                 # Configuração JWT
│   │   │
│   │   ├── controllers/                # Controladores (lógica de requisições)
│   │   │   ├── authController.js      # Auth (login, register)
│   │   │   ├── messageController.js   # Mensagens entre clientes
│   │   │   ├── orderController.js     # Pedidos de compra
│   │   │   ├── productController.js   # Produtos
│   │   │   ├── storeController.js     # Lojas
│   │   │   └── userController.js      # Utilizadores
│   │   │
│   │   ├── database/                   # Migrações e seeders
│   │   │   ├── migrations/
│   │   │   │   └── 001-create-tables.js
│   │   │   └── seeders/
│   │   │       └── 001-initial-data.js
│   │   │
│   │   ├── middlewares/                # Middlewares
│   │   │   ├── authMiddleware.js      # Validar token JWT
│   │   │   ├── errorMiddleware.js     # Tratamento de erros
│   │   │   ├── roleMiddleware.js      # Verificar permissões
│   │   │   └── validationMiddleware.js# Validar dados
│   │   │
│   │   ├── models/                     # Modelos Sequelize (BD)
│   │   │   ├── Category.js            # Categorias de produtos
│   │   │   ├── Client.js              # Clients (compradores)
│   │   │   ├── Message.js             # Mensagens
│   │   │   ├── Order.js               # Pedidos
│   │   │   ├── OrderItem.js           # Items dentro pedidos
│   │   │   ├── Product.js             # Produtos
│   │   │   ├── Review.js              # Reviews/Avaliações
│   │   │   ├── Seller.js              # Vendedores
│   │   │   ├── Store.js               # Lojas online
│   │   │   ├── User.js                # Utilizadores (base)
│   │   │   └── index.js               # Exportar modelos
│   │   │
│   │   ├── routes/                     # Rotas da API
│   │   │   ├── authRoutes.js          # /api/auth
│   │   │   ├── messageRoutes.js       # /api/messages
│   │   │   ├── orderRoutes.js         # /api/orders
│   │   │   ├── productRoutes.js       # /api/products
│   │   │   ├── storeRoutes.js         # /api/stores
│   │   │   ├── userRoutes.js          # /api/users
│   │   │   └── index.js               # Agregar todas rotas
│   │   │
│   │   ├── services/                   # Serviços (lógica de negócio)
│   │   │   ├── authService.js         # Lógica de autenticação
│   │   │   ├── messageService.js      # Lógica de mensagens
│   │   │   ├── orderService.js        # Lógica de pedidos
│   │   │   ├── productService.js      # Lógica de produtos
│   │   │   ├── storeService.js        # Lógica de lojas
│   │   │   └── userService.js         # Lógica de utilizadores
│   │   │
│   │   ├── uploads/                    # Ficheiros enviados
│   │   │   ├── products/              # Imagens de produtos
│   │   │   └── stores/                # Imagens de lojas
│   │   │
│   │   ├── utils/                      # Utilitários
│   │   │   ├── jwt.js                 # Funções JWT
│   │   │   ├── password.js            # Funções de password
│   │   │   ├── response.js            # Respostas padronizadas
│   │   │   └── validators.js          # Validações
│   │   │
│   │   └── validators/                 # Schemas de validação
│   │       ├── authValidator.js       # Validação auth
│   │       ├── orderValidator.js      # Validação pedidos
│   │       ├── productValidator.js    # Validação produtos
│   │       └── storeValidator.js      # Validação lojas
│   │
│   ├── package.json                    # Dependências npm
│   ├── README.md                       # Documentação backend
│   └── .env                           # Variáveis de ambiente
│
├── kuvia-frontend/                     # Frontend da aplicação
│   ├── src/
│   │   ├── App.jsx                     # Componente raiz
│   │   ├── App.css                     # Estilos globais
│   │   ├── AppRouter.jsx               # Configuração de rotas
│   │   ├── main.jsx                    # Entrada da aplicação
│   │   ├── index.css                   # CSS base
│   │   │
│   │   ├── assets/                     # Recursos estáticos
│   │   │   ├── icons/                 # Ícones SVG/PNG
│   │   │   └── images/                # Imagens
│   │   │
│   │   ├── components/                 # Componentes reutilizáveis
│   │   │   ├── common/
│   │   │   │   ├── RatingStars.jsx
│   │   │   │   ├── RatingStars.css
│   │   │   │   ├── WhatsAppButton.jsx
│   │   │   │   └── WhatsAppButton.css
│   │   │   ├── layout/
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Footer.css
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── ...
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductList.jsx
│   │   │   │   ├── ProductDetails.jsx
│   │   │   │   └── ...
│   │   │   ├── store/
│   │   │   │   ├── StoreCard.jsx
│   │   │   │   ├── StoreHeader.jsx
│   │   │   │   └── ...
│   │   │   └── ui/
│   │   │       ├── Button.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Loader.jsx
│   │   │       └── ...
│   │   │
│   │   ├── context/                    # Context API (estado global)
│   │   │   ├── AuthContext.jsx        # Autenticação
│   │   │   ├── CartContext.jsx        # Carrinho de compras
│   │   │   └── NotificationContext.jsx# Notificações
│   │   │
│   │   ├── hooks/                      # Custom React Hooks
│   │   │   ├── useAuth.js             # Hook autenticação
│   │   │   ├── useCart.js             # Hook carrinho
│   │   │   └── useDebounce.js         # Hook debounce
│   │   │
│   │   ├── pages/                      # Páginas (Views)
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── ManageProducts.jsx
│   │   │   │   ├── ManageOrders.jsx
│   │   │   │   ├── Settings.jsx
│   │   │   │   └── ...
│   │   │   ├── customer/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Checkout.jsx
│   │   │   │   ├── Orders.jsx
│   │   │   │   ├── Favorites.jsx
│   │   │   │   └── ...
│   │   │   ├── public/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── Stores.jsx
│   │   │   │   ├── StoreDetail.jsx
│   │   │   │   └── ...
│   │   │   └── seller/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── CreateProduct.jsx
│   │   │       ├── StoreSales.jsx
│   │   │       └── ...
│   │   │
│   │   ├── services/                   # Serviços (chamadas API)
│   │   │   ├── api.js                 # Configuração Axios
│   │   │   ├── authService.js         # Auth API calls
│   │   │   ├── messageService.js      # Messages API calls
│   │   │   ├── orderService.js        # Orders API calls
│   │   │   ├── productService.js      # Products API calls
│   │   │   ├── storeService.js        # Stores API calls
│   │   │   └── userService.js         # Users API calls
│   │   │
│   │   └── utils/                      # Utilitários
│   │       ├── constants.js           # Constantes
│   │       ├── formatters.js          # Formatação dados
│   │       └── validators.js          # Validação dados
│   │
│   ├── public/                         # Assets públicos
│   ├── package.json                    # Dependências npm
│   ├── README.md                       # Documentação frontend
│   ├── vite.config.js                 # Configuração Vite
│   ├── tailwind.config.js             # Configuração Tailwind
│   ├── postcss.config.js              # Configuração PostCSS
│   ├── eslint.config.js               # Configuração ESLint
│   ├── index.html                     # HTML raiz
│   └── .env                           # Variáveis de ambiente
│
└── .gitignore                         # Ficheiros a ignorar no git
```

## 🚀 Início Rápido

### Pré-requisitos
- Node.js (v14+)
- npm ou yarn
- PostgreSQL (v12+)

### Instalação Backend
```bash
cd kuvia-backend
npm install
npm run dev
```

### Instalação Frontend
```bash
cd kuvia-frontend
npm install
npm run dev
```

### Acessar
- Frontend: `http://localhost:5173/`
- Backend: `http://localhost:3000/`

## 📚 Documentação

- [Backend README](./kuvia-backend/README.md) - Detalhes do servidor
- [Frontend README](./kuvia-frontend/README.md) - Detalhes da UI

## 🔗 Links Importantes

- **Base de dados**: PostgreSQL
- **Autenticação**: JWT
- **Autorização**: Role-based (Client, Seller, Admin)
- **Uploads**: Multer (local storage ou cloud)

## 📞 Suporte

Para dúvidas ou problemas, contactar a equipa de desenvolvimento.
