import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="hidden md:block w-full border-t border-border-light bg-background-surface">
      
      <div className="w-full px-margin-page max-w-container-max mx-auto py-12 flex flex-col md:flex-row justify-between items-center gap-8">

        {/* Branding */}
        <div className="space-y-4 max-w-sm">
          <span className="font-headline-md text-headline-md font-bold text-ink-black">
            Kuvia
          </span>

          <p className="font-body-sm text-body-sm text-ink-gray">
            © {new Date().getFullYear()} Kuvia Moçambique. Construindo o futuro do comércio local.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-8">

          {/* Plataforma */}
          <div className="flex flex-col gap-2">
            <p className="font-label-md text-label-md text-ink-black">
              Plataforma
            </p>

            <Link
              to="/termos"
              className="font-body-sm text-body-sm text-ink-gray hover:text-primary transition-soft"
            >
              Termos
            </Link>

            <Link
              to="/privacidade"
              className="font-body-sm text-body-sm text-ink-gray hover:text-primary transition-soft"
            >
              Privacidade
            </Link>
          </div>

          {/* Suporte */}
          <div className="flex flex-col gap-2">
            <p className="font-label-md text-label-md text-ink-black">
              Suporte
            </p>

            <a href="#" className="font-body-sm text-body-sm text-ink-gray hover:text-primary transition-soft">
              WhatsApp
            </a>

            <a href="#" className="font-body-sm text-body-sm text-ink-gray hover:text-primary transition-soft">
              Centro de Ajuda
            </a>
          </div>

          {/* Siga-nos */}
          <div className="flex flex-col gap-2">
            <p className="font-label-md text-label-md text-ink-black">
              Siga-nos
            </p>

            <a href="#" className="font-body-sm text-body-sm text-ink-gray hover:text-primary transition-soft">
              Instagram
            </a>

            <a href="#" className="font-body-sm text-body-sm text-ink-gray hover:text-primary transition-soft">
              LinkedIn
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}