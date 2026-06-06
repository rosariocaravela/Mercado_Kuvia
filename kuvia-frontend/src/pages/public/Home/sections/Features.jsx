export default function Features() {
  const features = [
    {
      icon: 'add_business',
      title: 'Crie sua Loja',
      description: 'Setup instantâneo. Personalize cores, banners e logotipos sem precisar de uma única linha de código.'
    },
    {
      icon: 'share_reviews',
      title: 'Partilhe Fácil',
      description: 'Um link único e otimizado para sua bio do Instagram, status do WhatsApp e campanhas de anúncios.'
    },
    {
      icon: 'dashboard_customize',
      title: 'Gestão Ágil',
      description: 'Controle stock em tempo real, organize categorias e acompanhe suas vendas por um painel intuitivo.'
    },
    {
      icon: 'forum',
      title: 'Pedidos WhatsApp',
      description: 'Receba pedidos já organizados com detalhes do produto, quantidade e dados do cliente no seu WhatsApp.'
    }
  ];

  return (
    <section className="py-32 bg-background-subtle" id="funcionalidades">
      <div className="max-w-container-max mx-auto px-margin-page">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-headline-lg text-headline-lg text-ink-black mb-6">
            Tudo o que você precisa para prosperar
          </h2>
          <p className="font-body-md text-body-md text-ink-gray leading-relaxed">
            Simplificamos a tecnologia para que você possa focar no que faz melhor: vender e crescer seu negócio local com ferramentas de nível global.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-3xl border border-border-light hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
              </div>
              <h3 className="font-headline-md text-xl text-ink-black mb-4">{feature.title}</h3>
              <p className="font-body-sm text-body-sm text-ink-gray leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}