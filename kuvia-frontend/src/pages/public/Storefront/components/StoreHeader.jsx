import { useState } from 'react';
// ❌ REMOVIDO: import { formatCurrency } - não é usado aqui
import { getImageUrl } from '../../../../utils/imageUrl';

/**
 * Cabeçalho da loja pública (banner + identidade)
 */
export default function StoreHeader({ store }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    
    // Tenta usar a API nativa de partilha (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: store.name,
          text: `Visita a loja ${store.name} na Kuvia!`,
          url: url
        });
        return;
      } catch (err) {
        console.log('Partilha cancelada');
      }
    }
    
    // Fallback: copia para clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const bannerUrl = getImageUrl(store.banner_url);
  const logoUrl = getImageUrl(store.logo_url);

  return (
    <section className="relative mb-12">
      {/* Banner */}
      <div className="h-48 md:h-80 w-full overflow-hidden bg-surface-container-highest">
        {bannerUrl ? (
          <img 
            src={bannerUrl} 
            alt={`Banner de ${store.name}`}
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              console.error('❌ Erro ao carregar banner:', bannerUrl);
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-container to-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-8xl text-on-primary opacity-30">
              storefront
            </span>
          </div>
        )}
      </div>

      {/* Card de Identidade */}
      <div className="px-margin-page -mt-16 relative">
        <div className="bg-background-surface rounded-xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-end justify-between gap-6 border border-border-light">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center -mt-20 md:-mt-24">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={`Logo de ${store.name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    console.error('❌ Erro ao carregar logo:', logoUrl);
                    // ✅ Esconde a imagem e mostra fallback
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              
              {/* Fallback do logo (escondido quando imagem carrega OK) */}
              <span 
                className="material-symbols-outlined text-5xl text-primary"
                style={{ display: logoUrl ? 'none' : 'flex' }}
              >
                store
              </span>
            </div>

            {/* Informações */}
            <div className="pt-2">
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-ink-black mb-1">
                {store.name}
              </h1>
              {store.description && (
                <p className="text-on-surface-variant font-body-md mb-3">
                  {store.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-ink-gray font-label-md text-label-sm">
                {/* Localização */}
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    location_on
                  </span>
                  Moçambique
                </span>
                
                {/* ✅ CORREÇÃO: Avaliação mais robusta */}
                {store.rating !== null && store.rating !== undefined && store.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <span 
                      className="material-symbols-outlined text-[18px] text-amber-500"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    {Number(store.rating).toFixed(1)} ({store.totalReviews || 0} avaliações)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Botão Partilhar */}
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              className="bg-surface-container-low text-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">
                {copied ? 'check' : 'share'}
              </span>
              {copied ? 'Copiado!' : 'Partilhar'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}