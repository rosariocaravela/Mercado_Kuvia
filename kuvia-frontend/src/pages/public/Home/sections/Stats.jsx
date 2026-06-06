export default function Stats() {
  const stats = [
    {
      icon: 'storefront',
      value: '+1,500',
      label: 'Lojas Criadas',
      color: 'bg-primary/10 text-primary'
    },
    {
      icon: 'inventory_2',
      value: '+25k',
      label: 'Produtos Listados',
      color: 'bg-secondary-container/10 text-secondary'
    },
    {
      icon: 'trending_up',
      value: '+1,200',
      label: 'Vendedores Ativos',
      color: 'bg-primary text-white',
      highlight: true
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-container-max mx-auto px-margin-page">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-10 rounded-3xl border border-border-light hover:border-primary/30 transition-colors group ${
                stat.highlight ? 'bg-primary text-white border-primary hover:shadow-xl hover:shadow-primary/20' : 'bg-surface-container-low'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                stat.highlight ? 'bg-white/20 text-white' : stat.color
              }`}>
                <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
              </div>
              <div className={`font-headline-lg text-headline-lg mb-1 ${stat.highlight ? 'text-white' : 'text-ink-black'}`}>
                {stat.value}
              </div>
              <div className={`font-label-md uppercase tracking-widest text-xs ${stat.highlight ? 'opacity-80' : 'text-ink-gray'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}