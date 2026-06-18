export default function MarketingPromo() {
  return (
    <div className="glass-card p-8 rounded-2xl border border-primary/10 relative overflow-hidden">
      {/* Efeito de fundo */}
      <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl text-center md:text-left">
          <h4 className="font-headline-md text-headline-md text-ink-black mb-2">
            Aumente as suas vendas com Marketing
          </h4>
          <p className="font-body-md text-ink-gray">
            Crie campanhas automáticas para o Instagram e Facebook directamente do seu dashboard Kuvia.
          </p>
        </div>
        <button className="bg-primary text-white px-8 py-3 rounded-full font-label-md shadow-lg shadow-primary/20 hover:scale-[1.05] transition-all whitespace-nowrap">
          Começar Campanha
        </button>
      </div>
    </div>
  );
}