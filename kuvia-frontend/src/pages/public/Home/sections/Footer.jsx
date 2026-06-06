import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-border-light pt-20 pb-10">
      <div className="max-w-container-max mx-auto px-margin-page">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
          <div className="lg:col-span-4">
            <Link to="/" className="font-headline-md text-headline-md font-extrabold text-primary flex items-center gap-2 mb-8">
              <span className="text-2xl">🛍️</span>
              Kuvia
            </Link>
            <p className="font-body-md text-body-md text-ink-gray mb-8 leading-relaxed">
              A plataforma líder em Moçambique para criação de lojas online simplificadas. Empoderando o empreendedor local com tecnologia de ponta.
            </p>
            <div className="flex gap-4">
              {['language', 'chat', 'alternate_email'].map((icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-border-light flex items-center justify-center text-ink-gray hover:bg-primary hover:text-white hover:border-primary transition-all">
                  <span className="material-symbols-outlined text-lg">{icon}</span>
                </a>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="font-label-md text-label-md text-ink-black mb-6 uppercase tracking-widest text-xs">Plataforma</h4>
            <ul className="space-y-4">
              {['Funcionalidades', 'Preços', 'Exemplos de Lojas', 'Atualizações'].map((item) => (
                <li key={item}><a href="#" className="text-ink-gray hover:text-primary transition-colors font-body-sm">{item}</a></li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="font-label-md text-label-md text-ink-black mb-6 uppercase tracking-widest text-xs">Suporte</h4>
            <ul className="space-y-4">
              {['Central de Ajuda', 'Termos de Uso', 'Privacidade', 'Contacto'].map((item) => (
                <li key={item}><a href="#" className="text-ink-gray hover:text-primary transition-colors font-body-sm">{item}</a></li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-4">
            <h4 className="font-label-md text-label-md text-ink-black mb-6 uppercase tracking-widest text-xs">Onde Estamos</h4>
            <div className="space-y-4">
              <p className="text-ink-gray font-body-sm flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                <span>Maputo, Moçambique<br />Av. Julius Nyerere, 123, 4º Andar</span>
              </p>
              <p className="text-ink-gray font-body-sm flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">mail</span>
                <span>suporte@kuvia.co.mz</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border-light pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body-sm text-ink-gray text-xs">
            © 2024 Kuvia Moçambique. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            {['LinkedIn', 'Instagram', 'Facebook'].map((social) => (
              <a key={social} href="#" className="text-xs text-ink-gray hover:text-primary">{social}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}