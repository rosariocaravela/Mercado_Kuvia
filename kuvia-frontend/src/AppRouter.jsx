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

function AppRouter() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/store/:slug" element={<Storefront />} />

      {/* Rotas do Cliente */}
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

      {/* Rotas do Vendedor */}
      <Route
        path="/seller/dashboard"
        element={
          <ProtectedRoute allowedRoles={['SELLER']}>
            <SellerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products"
        element={
          <ProtectedRoute allowedRoles={['SELLER']}>
            <SellerProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/orders"
        element={
          <ProtectedRoute allowedRoles={['SELLER']}>
            <SellerOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/analytics"
        element={
          <ProtectedRoute allowedRoles={['SELLER']}>
            <SellerAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/settings"
        element={
          <ProtectedRoute allowedRoles={['SELLER']}>
            <SellerStoreSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/profile"
        element={
          <ProtectedRoute allowedRoles={['SELLER']}>
            <SellerProfile />
          </ProtectedRoute>
        }
      />

      {/* Rotas do Admin */}
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

      {/* Rota de Página Não Encontrada */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;