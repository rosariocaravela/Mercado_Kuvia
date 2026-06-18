import { NavLink } from 'react-router-dom';

const mobileItems = [
  { to: '/seller/dashboard', icon: 'home', label: 'Início' },
  { to: '/seller/products', icon: 'store', label: 'Produtos' },
  { to: '/seller/orders', icon: 'receipt_long', label: 'Vendas' },
  { to: '/seller/store', icon: 'visibility', label: 'Loja' },
  { to: '/seller/more', icon: 'menu', label: 'Mais' },
];

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2 pb-safe md:hidden bg-background-surface border-t border-border-light shadow-[0_-4px_12px_rgba(17,24,39,0.05)] z-50 rounded-t-xl">
      {mobileItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-transform duration-150 ${
              isActive
                ? 'text-primary font-bold scale-90'
                : 'text-on-surface-variant active:bg-surface-container'
            }`
          }
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            {item.icon}
          </span>
          <span className="font-label-sm text-[10px]">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}