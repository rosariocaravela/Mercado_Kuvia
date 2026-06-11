# 🛍️ Kuvia - Frontend

Frontend da plataforma Kuvia, construído com React 18, Vite e Tailwind CSS.

## 🚀 Tecnologias

- **React 18** - Biblioteca de UI
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Context API** - Gerenciamento de estado

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview de produção
npm run preview

# Lint
npm run lint
```

## 📁 Estrutura de Pastas

```
kuvia-frontend/
├── src/
│   ├── App.jsx                    # Componente raiz
│   ├── App.css                    # Estilos globais
│   ├── AppRouter.jsx              # Configuração de rotas
│   ├── main.jsx                   # Entrada da aplicação
│   ├── index.css                  # Estilos base
│   │
│   ├── assets/                    # Recursos estáticos
│   │   ├── icons/                # Ícones SVG/PNG
│   │   └── images/               # Imagens
│   │
│   ├── components/                # Componentes reutilizáveis
│   │   ├── common/               # Componentes comuns
│   │   │   ├── RatingStars.jsx   # Avaliação em estrelas
│   │   │   ├── RatingStars.css
│   │   │   ├── WhatsAppButton.jsx# Botão WhatsApp
│   │   │   └── WhatsAppButton.css
│   │   │
│   │   ├── layout/               # Componentes de layout
│   │   │   ├── Footer.jsx        # Rodapé
│   │   │   ├── Footer.css
│   │   │   ├── Header.jsx        # Cabeçalho/Navbar
│   │   │   ├── Sidebar.jsx       # Barra lateral
│   │   │   └── ...
│   │   │
│   │   ├── product/              # Componentes de produtos
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   └── ...
│   │   │
│   │   ├── store/                # Componentes de lojas
│   │   │   ├── StoreCard.jsx
│   │   │   ├── StoreHeader.jsx
│   │   │   └── ...
│   │   │
│   │   └── ui/                   # Componentes UI genéricos
│   │       ├── Button.jsx
│   │       ├── Modal.jsx
│   │       ├── Input.jsx
│   │       ├── Loader.jsx
│   │       └── ...
│   │
│   ├── context/                   # Context API para estado global
│   │   ├── AuthContext.jsx       # Contexto de autenticação
│   │   ├── CartContext.jsx       # Contexto do carrinho
│   │   └── NotificationContext.jsx# Contexto de notificações
│   │
│   ├── hooks/                     # Custom React Hooks
│   │   ├── useAuth.js            # Hook para autenticação
│   │   ├── useCart.js            # Hook para carrinho
│   │   └── useDebounce.js        # Hook para debounce
│   │
│   ├── pages/                     # Páginas (views)
│   │   ├── admin/                # Páginas admin
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ManageProducts.jsx
│   │   │   ├── ManageOrders.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── ...
│   │   │
│   │   ├── customer/             # Páginas cliente/comprador
│   │   │   ├── Home.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Favorites.jsx
│   │   │   └── ...
│   │   │
│   │   ├── public/               # Páginas públicas
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Stores.jsx
│   │   │   ├── StoreDetail.jsx
│   │   │   └── ...
│   │   │
│   │   └── seller/               # Páginas vendedor
│   │       ├── Dashboard.jsx
│   │       ├── CreateProduct.jsx
│   │       ├── StoreSales.jsx
│   │       └── ...
│   │
│   ├── services/                  # Serviços de API
│   │   ├── api.js                # Configuração do Axios
│   │   ├── authService.js        # Serviço de autenticação
│   │   ├── messageService.js     # Serviço de mensagens
│   │   ├── orderService.js       # Serviço de pedidos
│   │   ├── productService.js     # Serviço de produtos
│   │   ├── storeService.js       # Serviço de lojas
│   │   └── userService.js        # Serviço de utilizadores
│   │
│   └── utils/                     # Utilitários
│       ├── constants.js          # Constantes da aplicação
│       ├── formatters.js         # Funções de formatação
│       └── validators.js         # Funções de validação
│
├── public/                        # Arquivos estáticos públicos
├── package.json
├── README.md
├── vite.config.js                # Configuração do Vite
├── tailwind.config.js            # Configuração do Tailwind
├── postcss.config.js             # Configuração do PostCSS
├── eslint.config.js              # Configuração do ESLint
├── index.html                    # HTML raiz
└── .env                          # Variáveis de ambiente (não incluir no git)
```

## 🔑 Variáveis de Ambiente

Criar arquivo `.env` na raiz do frontend:

```env
# API
VITE_API_BASE_URL=http://localhost:3000/api

# Autenticação
VITE_JWT_STORAGE_KEY=kuvia_token

# Modo desenvolvimento
VITE_DEV_MODE=true
```

## 🎯 Fluxo de Utilizadores

### Cliente (Comprador)
1. Visita `localhost:5173/`
2. Pesquisa lojas ou produtos
3. Acessa loja via slug: `/store/:slug`
4. Adiciona produtos ao carrinho
5. Faz checkout (sem necessidade de login obrigatório)
6. Contacta vendedor via WhatsApp

### Vendedor (Dono de Loja)
1. Faz registro/login
2. Acessa dashboard: `/seller/dashboard`
3. Cria e gerencia loja
4. Cria e gerencia produtos
5. Visualiza pedidos e vendas
6. Responde mensagens de clientes

### Admin
1. Faz login de admin
2. Acessa painel admin: `/admin/dashboard`
3. Gerencia utilizadores, lojas, produtos
4. Visualiza estatísticas globais
5. Gerencia relatórios

## 🔐 Autenticação

- **LocalStorage** - Armazena token JWT
- **AuthContext** - Gerencia estado de autenticação
- **useAuth Hook** - Acesso fácil ao contexto
- **Rutas protegidas** - Redirecionam se não autenticado

## 🎨 Temas e Estilos

- **Tailwind CSS** - Estilos utilitários
- **Tailwind Config** - Customização de cores e temas
- **CSS Modules** (opcional) - Para estilos locais de componentes

## 📱 Responsive Design

Todos os componentes são responsive:
- Mobile first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`
- Componentes adaptáveis a diferentes tamanhos

## 🚀 Performance

- **Vite** - Build rápido e HMR
- **Code Splitting** - Rotas lazy-loaded
- **Image Optimization** - Compressão de imagens
- **Minificação** - Assets otimizados

## 📝 Componentes Principais

### Common Components
- `RatingStars` - Exibe avaliação em estrelas
- `WhatsAppButton` - Botão flutuante de WhatsApp

### Layout Components
- `Header` - Navbar com navegação
- `Footer` - Rodapé da aplicação
- `Sidebar` - Menu lateral

### UI Components
- `Button` - Botão genérico
- `Modal` - Diálogo modal
- `Input` - Campo de input
- `Loader` - Spinner de carregamento

### Product Components
- `ProductCard` - Card de produto
- `ProductList` - Lista de produtos
- `ProductDetails` - Detalhes do produto

### Store Components
- `StoreCard` - Card de loja
- `StoreHeader` - Header da loja

## 🔄 Context & Hooks

### AuthContext
```javascript
const { user, isAuthenticated, login, logout } = useAuth();
```

### CartContext
```javascript
const { cart, addToCart, removeFromCart, total } = useCart();
```

### useDebounce Hook
```javascript
const debouncedValue = useDebounce(searchValue, 500);
```

## 🐛 Desenvolvimento

```bash
# Iniciar servidor dev
npm run dev

# Lint code
npm run lint

# Build para produção
npm run build

# Preview build local
npm run preview
```

## 📞 Suporte

Para dúvidas ou problemas, contactar a equipa de desenvolvimento.
