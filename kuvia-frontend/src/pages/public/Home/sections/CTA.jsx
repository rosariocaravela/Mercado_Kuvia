import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-24 px-margin-page">
      <div className="max-w-container-max mx-auto">
        <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-headline-xl-mobile md:font-headline-lg text-headline-xl-mobile md:text-headline-lg text-white mb-8">
              Pronto para digitalizar o seu negócio?
            </h2>
            <p className="font-body-lg text-body-lg text-white/80 mb-12 leading-relaxed">
              Junte-se a milhares de empreendedores que estão transformando o comércio local em Moçambique com a Kuvia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary px-12 py-5 rounded-2xl font-label-md text-label-md shadow-2xl hover:scale-105 transition-all"
              >
                Começar Agora Gratuitamente
              </Link>
              <button className="bg-primary-container/20 text-white border border-white/30 px-12 py-5 rounded-2xl font-label-md text-label-md hover:bg-white/10 transition-all">
                Falar com Consultor
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}