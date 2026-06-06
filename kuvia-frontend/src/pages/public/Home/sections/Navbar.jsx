import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-background-surface/80 backdrop-blur-md border-b border-border-light sticky top-0 z-[60]">
      <div className="flex justify-between items-center w-full px-margin-page max-w-container-max mx-auto h-20">
        <div className="flex items-center gap-10">
          <Link to="/" className="font-headline-md text-headline-md font-extrabold text-primary flex items-center gap-2">
            <span className="text-2xl">🛍️</span>
            Kuvia
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#funcionalidades" className="text-primary font-label-md text-label-md relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-primary">
              Funcionalidades
            </a>
            <a href="#precos" className="text-ink-gray hover:text-primary transition-all font-label-md text-label-md">
              Preços
            </a>
            <a href="#recursos" className="text-ink-gray hover:text-primary transition-all font-label-md text-label-md">
              Recursos
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:block text-ink-black font-label-md hover:text-primary transition-colors px-4">
            Entrar
          </Link>
          <Link 
            to="/register" 
            className="bg-primary text-on-primary px-7 py-3 rounded-full font-label-md text-label-md hover:bg-primary-container hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
          >
            Criar Minha Loja
          </Link>
        </div>
      </div>
    </nav>
  );
}