import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Páginas Públicas
import Home from './pages/public/Home/sections/Home';
import Login from './pages/public/Login/Login';
import Register from './pages/public/Register/Register';
import Explore from './pages/public/Explore/Explore';
import Storefront from './pages/public/Storefront/Storefront';

// Páginas do Cliente
import CustomerDashboard from './pages/customer/Dashboard/CustomerDashboard';
import CustomerOrders from './pages/customer/Orders/Orders';
import CustomerFavorites from './pages/customer/Favorites/Favorites';
import CustomerMessages from './pages/customer/Messages/Messages';
import CustomerProfile from './pages/customer/Profile/CustomerProfile';

// Páginas do Vendedor
import SellerDashboard from './pages/seller/Dashboard/SellerDashboard';
import SellerProducts from './pages/seller/Products/Products';
import SellerOrders from './pages/seller/Orders/Orders';
import SellerAnalytics from './pages/seller/Analytics/Analytics';
import SellerStoreSettings from './pages/seller/StoreSettings/StoreSettings';
import SellerProfile from './pages/seller/Profile/SellerProfile';
import CreateStoreWizard from './pages/seller/CreateStoreWizard';

// ✨ NOVO: Layout do Vendedor (sidebar + topbar + bottom nav)
import SellerLayout from './components/layout/SellerLayout';

// Páginas do Admin
import AdminDashboard from './pages/admin/Dashboard/AdminDashboard';
import AdminUsers from './pages/admin/Users/Users';
import AdminStores from './pages/admin/Stores/Stores';
import AdminReports from './pages/admin/Reports/Reports';

// Componente de Loading
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-ink-gray font-body-md">Carregando...</p>
      </div>
    </div>
  );
}

// Componente de Página Não Encontrada
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="font-headline-xl text-primary mb-4">404</h1>
        <p className="font-body-lg text-ink-gray mb-8">Página não encontrada</p>
        <a href="/" className="bg-primary text-white px-6 py-3 rounded-full font-label-md">
          Voltar para Home
        </a>
      </div>
    </div>
  );
}

// Placeholder para páginas em desenvolvimento
function ComingSoon({ title }) {
  return (
    <div className="px-margin-page py-16 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-3xl text-primary">construction</span>
      </div>
      <h2 className="font-headline-md text-ink-black mb-2">{title}</h2>
      <p className="font-body-md text-ink-gray">Esta página está em desenvolvimento. Em breve!</p>
    </div>
  );
}

// Rota Protegida (requer autenticação)
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function getDefaultAuthenticatedRoute(user) {
  if (!user) return '/login';
  if (user.role === 'ADMIN') return '/admin';
  if (user.role === 'SELLER') return '/seller/dashboard';
  return '/dashboard';
}

function AppRouter() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      {/* ============================================
          ROTAS PÚBLICAS
      ============================================ */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to={getDefaultAuthenticatedRoute(user)} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={getDefaultAuthenticatedRoute(user)} /> : <Register />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/store/:slug" element={<Storefront />} />

      {/* ============================================
          ROTAS DO CLIENTE
      ============================================ */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['CLIENT']}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute allowedRoles={['CLIENT']}>
            <CustomerOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute allowedRoles={['CLIENT']}>
            <CustomerFavorites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute allowedRoles={['CLIENT']}>
            <CustomerMessages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['CLIENT']}>
            <CustomerProfile />
          </ProtectedRoute>
        }
      />

      {/* ============================================
          ROTAS DO VENDEDOR - COM LAYOUT (Sidebar + TopBar)
      ============================================ */}
      <Route
        path="/seller"
        element={
          <ProtectedRoute allowedRoles={['SELLER']}>
            <SellerLayout />
          </ProtectedRoute>
        }
      >
        {/* Rota padrão: /seller → redireciona para /seller/dashboard */}
        <Route index element={<Navigate to="/seller/dashboard" replace />} />
        
        {/* Dashboard principal */}
        <Route path="dashboard" element={<SellerDashboard />} />
        
        {/* Páginas em desenvolvimento (placeholders) */}
        <Route path="products" element={<ComingSoon title="Gestão de Produtos" />} />
        <Route path="products/new" element={<ComingSoon title="Criar Novo Produto" />} />
        <Route path="orders" element={<ComingSoon title="Gestão de Encomendas" />} />
        <Route path="customers" element={<ComingSoon title="Gestão de Clientes" />} />
        <Route path="analytics" element={<ComingSoon title="Análise e Estatísticas" />} />
        <Route path="design" element={<ComingSoon title="Design da Loja" />} />
        <Route path="marketing" element={<ComingSoon title="Marketing e Campanhas" />} />
        <Route path="settings" element={<ComingSoon title="Definições da Loja" />} />
        <Route path="more" element={<ComingSoon title="Mais Opções" />} />
        
        {/* Redirecionar /seller/store para a loja pública do vendedor */}
        <Route path="store" element={<Navigate to="/store/minha-loja" replace />} />
      </Route>

      {/* ✨ Wizard de criação de loja (SEM sidebar - layout próprio) */}
      <Route
        path="/seller/criar-loja"
        element={
          <ProtectedRoute allowedRoles={['SELLER']}>
            <CreateStoreWizard />
          </ProtectedRoute>
        }
      />

      {/* ============================================
          ROTAS DO ADMIN
      ============================================ */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminStores />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminReports />
          </ProtectedRoute>
        }
      />

      {/* ============================================
          ROTA DE PÁGINA NÃO ENCONTRADA
      ============================================ */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;