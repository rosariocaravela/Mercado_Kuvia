import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Preciso pagar para começar?",
      answer: "Não! Você pode começar com nosso plano gratuito para experimentar todas as funcionalidades essenciais e lançar sua loja hoje mesmo sem custos."
    },
    {
      question: "Como recebo os pagamentos?",
      answer: "A Kuvia integra a intenção de compra. Os pagamentos são feitos diretamente entre você e o cliente via M-Pesa, E-Mola ou transferência bancária, conforme o acordo final no WhatsApp."
    },
    {
      question: "Posso usar meu próprio domínio?",
      answer: "Sim, nos nossos planos profissionais oferecemos suporte total para conexão de domínios personalizados (ex: www.sualoja.co.mz)."
    },
    {
      question: "Preciso de conhecimentos técnicos?",
      answer: "Absolutamente não! Nossa plataforma foi desenvolvida para ser intuitiva e fácil de usar. Se você sabe usar WhatsApp, sabe usar a Kuvia."
    }
  ];

  return (
    <section className="py-24 bg-background-subtle">
      <div className="max-w-container-max mx-auto px-margin-page">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-ink-black mb-6">
              Perguntas Frequentes
            </h2>
            <p className="font-body-md text-body-md text-ink-gray">
              Tire suas dúvidas sobre a plataforma Kuvia
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-border-light overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  className="w-full flex justify-between items-center p-6 text-left font-label-md text-label-md hover:bg-surface-container-low transition-colors"
                >
                  <span className="text-ink-black font-semibold">{faq.question}</span>
                  <span className={`material-symbols-outlined transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}>
                    expand_more
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="font-body-sm text-body-sm text-ink-gray leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}