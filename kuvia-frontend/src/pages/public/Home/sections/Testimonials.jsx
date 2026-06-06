export default function Testimonials() {
  const testimonials = [
    {
      quote: "A Kuvia mudou radicalmente a forma como gerencio as vendas do meu atelier. Agora meus clientes veem o catálogo profissional e o pedido já chega pronto no WhatsApp, sem confusão.",
      author: "Ana C.",
      role: "Fundadora, Atelier de Moda Local",
      avatar: "https://i.pravatar.cc/150?img=5",
      featured: true
    },
    {
      quote: "Simples, rápido e eficiente. Consegui montar minha loja em menos de 5 minutos. Super recomendo!",
      author: "Mateus S.",
      role: "Gadgets Express",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    {
      quote: "O suporte é incrível e a plataforma é muito fácil de usar. Minhas vendas aumentaram 30%.",
      author: "Sara M.",
      role: "Sara Jóias",
      avatar: "https://i.pravatar.cc/150?img=9"
    }
  ];

  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-page">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-label-sm mb-6 uppercase tracking-widest text-[10px]">
            Depoimentos
          </div>
          <h2 className="font-headline-lg text-headline-lg text-ink-black mb-6">
            Histórias de sucesso que nos inspiram
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`${
                testimonial.featured 
                  ? 'bg-surface-container-low p-8 md:p-12 rounded-[2rem] relative border border-border-light lg:col-span-2' 
                  : 'bg-white p-8 rounded-[2rem] border border-border-light shadow-sm'
              }`}
            >
              {testimonial.featured && (
                <span className="material-symbols-outlined text-primary/10 text-8xl absolute top-8 right-8 select-none">
                  format_quote
                </span>
              )}
              <p className={`relative z-10 mb-8 leading-relaxed italic ${
                testimonial.featured ? 'font-body-lg text-body-lg text-ink-black' : 'font-body-md text-ink-gray'
              }`}>
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-5">
                <img alt={testimonial.author} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" src={testimonial.avatar} />
                <div>
                  <div className="font-headline-md text-lg text-ink-black">{testimonial.author}</div>
                  <div className="font-body-sm text-ink-gray">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}