import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './../../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: 'dashboard', label: 'Visão Geral', path: '/dashboard', filled: true },
    { icon: 'favorite', label: 'Favoritos', path: '/favoritos', filled: false },
    { icon: 'shopping_bag', label: 'Wishlist', path: '/wishlist', filled: false },
    { icon: 'chat_bubble', label: 'Mensagens', path: '/mensagens', filled: false },
    { icon: 'settings', label: 'Definições', path: '/definicoes', filled: false },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden md:flex flex-col sticky top-16 h-[calc(100vh-64px)] w-64 py-4 bg-white border-r border-border-light">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              person
            </span>
          </div>
          <div>
            <h3 className="font-label-md text-label-md text-ink-black">Minha Conta</h3>
            <p className="font-body-sm text-body-sm text-ink-gray">Cliente Premium</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-all ${isActive(item.path)
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: `'FILL' ${item.filled ? 1 : 0}` }}
            >
              {item.icon}
            </span>
            <span className="font-label-md text-label-md">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto px-2 space-y-1 border-t border-border-light pt-4">
        <Link to="/ajuda" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-all">
          <span className="material-symbols-outlined">help_outline</span>
          <span className="font-label-md text-label-md">Ajuda</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-error hover:bg-error/5 rounded-lg transition-all cursor-pointer border-none bg-transparent"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label-md text-label-md">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;