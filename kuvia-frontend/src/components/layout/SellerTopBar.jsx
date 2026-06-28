import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function SellerTopBar({ title = 'Minha Loja Digital' }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Capitaliza primeira letra
  const capitalize = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // ✅ Primeiro nome com primeira letra maiúscula
  const getFirstName = () => {
    if (!user) return 'Utilizador';

    const fullName =
      user.fullName ||
      user.name ||
      user.businessName ||
      user.email ||
      'Utilizador';

    return capitalize(fullName.split(' ')[0]);
  };

  // ✅ Iniciais do avatar
  const getInitials = () => {
    if (!user) return 'U';

    const name =
      user.fullName ||
      user.name ||
      user.businessName ||
      user.email ||
      'U';

    const parts = name.split(' ');

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return name.charAt(0).toUpperCase();
  };

  const userName = getFirstName();
  const userInitials = getInitials();

  return (
    <header className="flex justify-between items-center w-full px-margin-page h-16 bg-background-surface border-b border-border-light sticky top-0 z-40">
      <h1 className="font-headline-md text-headline-md font-bold text-ink-black">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Publicar Loja (visível apenas em telas pequenas, já que a sidebar fica oculta) */}
        {user && user.role === 'SELLER' && (
          <button
            onClick={() => navigate('/seller/criar-loja')}
            className="md:hidden bg-primary text-white px-3 py-2 rounded-lg font-label-sm"
          >
            Publicar Loja
          </button>
        )}
        {/* Status Online */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-full">
          <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
          <span className="text-label-sm font-label-sm text-secondary">Online</span>
        </div>

        {/* Notificações */}
        <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-border-light mx-1"></div>

        {/* Perfil - ✅ CORRIGIDO: usar userInitials */}
        <button className="flex items-center gap-2 p-1 pl-1 pr-3 hover:bg-surface-container rounded-full transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold border border-border-light">
            {userInitials}
          </div>
          <span className="font-label-md text-label-md hidden md:inline">{userName}</span>
        </button>
      </div>
    </header>
  );
}