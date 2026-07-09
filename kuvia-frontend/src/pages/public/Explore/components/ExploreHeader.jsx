import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-header border-b border-border-light bg-background-surface">

      <div className="flex justify-between items-center w-full px-margin-page max-w-container-max mx-auto h-16">

        {/* LOGO + MENU */}
        <div className="flex items-center gap-8">

          <Link
            to="/"
            className="font-headline-md text-headline-md font-bold text-ink-black"
          >
            Kuvia
          </Link>

          <nav className="hidden md:flex items-center gap-6">

            <NavLink
              to="/explore"
              className={({ isActive }) =>
                isActive
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-on-surface-variant hover:text-primary transition-colors"
              }
            >
              Explorar
            </NavLink>

            <NavLink
              to="/funcionalidades"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              Funcionalidades
            </NavLink>

            <NavLink
              to="/precos"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              Preços
            </NavLink>

          </nav>
        </div>

        {/* AÇÕES */}
        <div className="flex items-center gap-4">

          {/* Login */}
          <Link
            to="/login"
            className="hidden md:block font-label-md text-label-md text-primary hover:opacity-80"
          >
            Login
          </Link>

          {/* Criar loja */}
          <Link
            to="/register"
            className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-md hover:scale-[0.98] transition-soft shadow-md"
          >
            Criar Loja
          </Link>

        </div>

      </div>
    </header>
  );
}