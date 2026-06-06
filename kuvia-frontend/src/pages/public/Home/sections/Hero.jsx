import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero-mesh relative overflow-hidden pt-20 pb-32">
      <div className="max-w-container-max mx-auto px-margin-page grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="z-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-label-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            O Futuro do Comércio em Moçambique
          </div>
          <h1 className="font-headline-xl-mobile lg:font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-ink-black mb-8 leading-[1.1]">
            Crie sua <span className="text-primary">Loja Online</span> em minutos
          </h1>
          <p className="font-body-lg text-body-lg text-ink-gray mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            A plataforma SaaS tudo-em-um para empreendedores moçambicanos. Construa sua montra digital,
            exponha produtos e venda pelo WhatsApp com facilidade profissional.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <Link
              to="/register"
              className="bg-primary text-white px-10 py-5 rounded-2xl font-label-md text-label-md shadow-xl shadow-primary/25 hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Começar Agora
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </Link>
            <button className="bg-white border border-border-light text-ink-black px-10 py-5 rounded-2xl font-label-md text-label-md hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
              Ver Exemplo
            </button>
          </div>
          
          {/* Social Proof */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
            <div className="flex -space-x-3">
              <img alt="Avatar" className="w-12 h-12 rounded-full border-4 border-white object-cover"
                src="https://i.pravatar.cc/150?img=1" />
              <img alt="Avatar" className="w-12 h-12 rounded-full border-4 border-white object-cover"
                src="https://i.pravatar.cc/150?img=2" />
              <img alt="Avatar" className="w-12 h-12 rounded-full border-4 border-white object-cover"
                src="https://i.pravatar.cc/150?img=3" />
              <div className="w-12 h-12 rounded-full border-4 border-white bg-primary text-white flex items-center justify-center text-xs font-bold">
                +1k
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-sm">star</span>
                ))}
              </div>
              <p className="text-body-sm font-label-md text-ink-black">Apoiando +1,000 empreendedores em Moçambique</p>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75 group-hover:scale-90 transition-transform duration-700"></div>
          <div className="relative z-10 p-4 bg-white/40 backdrop-blur-sm rounded-[2rem] border border-white/50 mockup-shadow overflow-hidden">
            <img alt="Kuvia Dashboard" className="w-full h-auto rounded-xl"
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop" />
          </div>
        </div>
      </div>
    </section>
  );
}