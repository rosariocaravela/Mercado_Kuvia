export default function StorePreview({ storeName, logoUrl, bannerUrl, categories }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="font-label-md text-on-surface">Pré-visualização</label>
        <span className="text-on-surface-variant flex items-center gap-1 font-label-sm">
          <span className="material-symbols-outlined text-sm">visibility</span> Live
        </span>
      </div>
      
      <div className="relative w-full rounded-xl overflow-hidden border border-border-light h-48">
        {/* Banner Background */}
        <div className="absolute inset-0 bg-surface-container-highest flex items-center justify-center">
          {bannerUrl ? (
            <img src={bannerUrl} alt="Banner preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-on-surface-variant text-sm">Banner da loja</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        {/* Header Overlay */}
        <div className="absolute top-0 w-full h-14 px-4 flex items-center justify-between bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white border border-border-light flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="material-symbols-outlined text-gray-400 text-sm">store</span>
              )}
            </div>
            <span className="font-label-md text-ink-black truncate max-w-[150px]">
              {storeName || 'Nome da Loja'}
            </span>
          </div>
          <div className="flex gap-2">
            {categories?.slice(0, 2).map((cat, i) => (
              <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                {cat}
              </span>
            ))}
          </div>
        </div>
        
        {/* Floating Content Placeholder */}
        <div className="absolute bottom-4 left-6 flex flex-col gap-1">
          <div className="h-4 w-32 bg-white/80 rounded" />
          <div className="h-3 w-20 bg-white/60 rounded" />
        </div>
      </div>
      
      {/* URL Preview */}
      <div className="bg-background-subtle border border-border-light rounded-lg p-4 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">link</span>
        <div>
          <p className="font-label-sm text-on-surface-variant">Seu link:</p>
          <p className="font-body-md font-semibold text-primary break-all">
            kuvia.co.mz/<span className="underline decoration-primary/30">{storeName?.toLowerCase().replace(/\s+/g, '-') || 'nome-da-loja'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}