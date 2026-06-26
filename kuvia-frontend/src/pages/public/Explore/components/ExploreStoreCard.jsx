import { Link } from 'react-router-dom';
import { getImageUrl } from '../../../../utils/imageUrl';

export default function ExploreStoreCard({ store }) {
  const bannerUrl = getImageUrl(store.banner_url);
  const logoUrl = getImageUrl(store.logo_url);

  // Obter categoria principal (se existir)
  const category = store.categories?.[0] || store.category || 'Loja';

  return (
    <Link
      to={`/store/${store.slug}`}
      className="group bg-background-surface rounded-2xl border border-border-light overflow-hidden transition-soft hover:shadow-xl hover:-translate-y-1 block"
    >
      {/* Banner */}
      <div className="relative h-48 overflow-hidden">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={store.name}
            className="w-full h-full object-cover transition-soft group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback gradiente */}
        <div 
          className="w-full h-full bg-gradient-to-br from-primary-container to-primary flex items-center justify-center"
          style={{ display: bannerUrl ? 'none' : 'flex' }}
        >
          <span className="material-symbols-outlined text-6xl text-on-primary opacity-50">
            storefront
          </span>
        </div>

        {/* Badge de rating */}
        {store.rating && store.rating > 0 && (
          <div className="absolute top-4 right-4 bg-background-surface/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
            <span 
              className="material-symbols-outlined text-[16px] text-tertiary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="font-label-sm text-label-sm text-ink-black">
              {Number(store.rating).toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-6 relative">
        {/* Logo sobreposto */}
        <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl border-4 border-background-surface overflow-hidden bg-white shadow-md">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={store.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="w-full h-full flex items-center justify-center bg-surface-container-low"
            style={{ display: logoUrl ? 'none' : 'flex' }}
          >
            <span className="material-symbols-outlined text-2xl text-primary">store</span>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-headline-md text-headline-md text-ink-black group-hover:text-primary transition-soft truncate">
              {store.name}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
              {typeof category === 'string' ? category : category.name || 'Loja'}
            </p>
            {store.description && (
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                {store.description}
              </p>
            )}
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // TODO: Implementar "Seguir loja"
              alert('Funcionalidade de seguir em breve!');
            }}
            className="bg-surface-container text-primary font-label-sm text-label-sm px-4 py-2 rounded-lg hover:bg-primary hover:text-on-primary transition-soft whitespace-nowrap"
          >
            Seguir
          </button>
        </div>
      </div>
    </Link>
  );
}