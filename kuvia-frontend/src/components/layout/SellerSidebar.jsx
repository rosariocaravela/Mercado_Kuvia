import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const menuItems = [
  { to: '/seller/dashboard', icon: 'dashboard', label: 'Visão Geral' },
  { to: '/seller/products', icon: 'inventory_2', label: 'Produtos' },
  { to: '/seller/orders', icon: 'shopping_cart', label: 'Encomendas' },
  { to: '/seller/customers', icon: 'group', label: 'Clientes' },
  { to: '/seller/analytics', icon: 'analytics', label: 'Análise' },
  { to: '/seller/design', icon: 'palette', label: 'Design da Loja' },
  { to: '/seller/marketing', icon: 'campaign', label: 'Marketing' },
  { to: '/seller/settings', icon: 'settings', label: 'Definições' },
];

export default function SellerSidebar({ storeName = 'Minha Loja', plan = 'Plano Profissional' }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col sticky top-0 h-screen py-4 bg-background-subtle border-r border-border-light w-64">
      {/* Logo / Nome da Loja */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
            store
          </span>
        </div>
        <div>
          <h2 className="font-headline-md text-label-md font-bold text-primary">{storeName}</h2>
          <p className="font-body-sm text-body-sm text-ink-gray">{plan}</p>
        </div>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-container text-on-primary-container scale-[0.98]'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`
            }
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-label-md text-label-md">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Acções no Rodapé */}
      <div className="px-4 py-6 border-t border-border-light space-y-2">
        <button
          onClick={() => navigate('/seller/criar-loja')}
          className="w-full bg-primary text-white font-label-md py-3 rounded-lg hover:opacity-90 transition-all shadow-sm"
        >
          Publicar Loja
        </button>
        <a
          href="/ajuda"
          className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-all"
        >
          <span className="material-symbols-outlined">help_outline</span>
          <span className="font-label-md text-label-md">Ajuda</span>
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container rounded-lg transition-all"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label-md text-label-md">Terminar sessão</span>
        </button>
      </div>
    </aside>
  );
}