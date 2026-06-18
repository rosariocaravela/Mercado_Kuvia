import { useAuth } from '../../hooks/useAuth';

export default function SellerTopBar({ title = 'Minha Loja Digital' }) {
  const { user } = useAuth();
  const userName = user?.fullName || 'Utilizador';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="flex justify-between items-center w-full px-margin-page h-16 bg-background-surface border-b border-border-light sticky top-0 z-40">
      <h1 className="font-headline-md text-headline-md font-bold text-ink-black">{title}</h1>

      <div className="flex items-center gap-4">
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

        {/* Perfil */}
        <button className="flex items-center gap-2 p-1 pl-1 pr-3 hover:bg-surface-container rounded-full transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold border border-border-light">
            {userInitial}
          </div>
          <span className="font-label-md text-label-md hidden md:inline">{userName}</span>
        </button>
      </div>
    </header>
  );
}