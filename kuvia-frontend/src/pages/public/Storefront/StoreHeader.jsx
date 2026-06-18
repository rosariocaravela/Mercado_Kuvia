export default function StoreHeader({ store }) {
    return (
      <div className="relative">
        {/* Banner */}
        <div className="h-48 md:h-64 bg-surface-container-highest">
          {store.banner_url ? (
            <img src={store.banner_url} alt={store.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl">storefront</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
        
        {/* Info */}
        <div className="max-w-container-max mx-auto px-margin-page">
          <div className="relative -mt-16 mb-6 flex items-end gap-4">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-background-surface border-4 border-background-surface shadow-lg flex items-center justify-center overflow-hidden">
              {store.logo_url ? (
                <img src={store.logo_url} alt={store.name} className="w-full h-full object-contain" />
              ) : (
                <span className="material-symbols-outlined text-3xl text-outline-variant">store</span>
              )}
            </div>
            <div className="pb-2">
              <h1 className="font-headline-lg text-ink-black">{store.name}</h1>
              {store.description && <p className="font-body-md text-on-surface-variant mt-1">{store.description}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }