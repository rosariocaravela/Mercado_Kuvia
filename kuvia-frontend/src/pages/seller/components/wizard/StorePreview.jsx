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
        <div className="absolute inset-0 bg-surface-container-highest flex items-center justify-center">
          {bannerUrl ? (
            <img src={bannerUrl} alt="Banner preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-on-surface-variant text-sm">Banner da loja</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
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
        </div>
      </div>
      
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