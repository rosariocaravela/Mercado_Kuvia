import { useState, useEffect } from 'react';

const CATEGORIES = [
  { id: 'fashion', label: 'Moda & Vestuário' },
  { id: 'electronics', label: 'Electrónica' },
  { id: 'home', label: 'Casa & Decoração' },
  { id: 'beauty', label: 'Saúde & Beleza' },
  { id: 'food', label: 'Alimentação' },
  { id: 'services', label: 'Serviços' },
  { id: 'kids', label: 'Kids & Brinquedos' },
];

const PROVINCES = [
  'Maputo', 'Matola', 'Beira', 'Nampula', 'Tete',
  'Nacala', 'Quelimane', 'Chimoio', 'Xai-Xai', 'Inhambane'
];

export default function ExploreSidebar({ filters, onFilterChange, onClear }) {
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // Debounce da pesquisa (espera 500ms após parar de digitar)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFilterChange({ ...filters, search: localSearch, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const toggleCategory = (catId) => {
    const current = filters.categories || [];
    const newCategories = current.includes(catId)
      ? current.filter(c => c !== catId)
      : [...current, catId];
    onFilterChange({ ...filters, categories: newCategories, page: 1 });
  };

  return (
    <aside className="w-full md:w-80 shrink-0 space-y-8">
      <div className="bg-background-surface p-6 rounded-2xl border border-border-light card-shadow sticky top-24">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline-md text-headline-md text-ink-black">Filtros</h2>
          <button 
            onClick={onClear}
            className="text-primary font-label-sm text-label-sm hover:underline"
          >
            Limpar
          </button>
        </div>

        {/* Pesquisa */}
        <div className="space-y-2 mb-6">
          <label className="font-label-md text-label-md text-on-surface-variant">
            O que procura?
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Nome da loja ou produto..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-light focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-soft text-body-sm font-body-sm"
            />
          </div>
        </div>

        {/* Categorias */}
        <div className="space-y-3 mb-6">
          <p className="font-label-md text-label-md text-ink-black">Categorias</p>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(filters.categories || []).includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="w-5 h-5 rounded border-border-light text-primary focus:ring-primary"
                />
                <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-ink-black transition-soft">
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Localização */}
        <div className="space-y-3 mb-6">
          <p className="font-label-md text-label-md text-ink-black">Localização</p>
          <select
            value={filters.province || ''}
            onChange={(e) => onFilterChange({ ...filters, province: e.target.value, page: 1 })}
            className="w-full p-3 rounded-xl border border-border-light focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-soft text-body-sm font-body-sm bg-background-subtle"
          >
            <option value="">Todas as províncias</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Gama de Preços */}
        <div className="space-y-3 mb-6">
          <p className="font-label-md text-label-md text-ink-black">Gama de Preços</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value, page: 1 })}
              className="w-1/2 p-2.5 rounded-lg border border-border-light text-body-sm font-body-sm"
            />
            <span className="text-outline">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value, page: 1 })}
              className="w-1/2 p-2.5 rounded-lg border border-border-light text-body-sm font-body-sm"
            />
          </div>
        </div>

        {/* Avaliação */}
        <div className="space-y-3">
          <p className="font-label-md text-label-md text-ink-black">Avaliação Mínima</p>
          <div className="flex gap-2">
            {['4.0', '4.5'].map((rating) => (
              <button
                key={rating}
                onClick={() => onFilterChange({ 
                  ...filters, 
                  minRating: filters.minRating === rating ? null : rating, 
                  page: 1 
                })}
                className={`flex-1 py-2 rounded-lg border text-label-sm font-label-sm transition-soft ${
                  filters.minRating === rating
                    ? 'border-primary bg-primary text-on-primary'
                    : 'border-border-light hover:border-primary hover:text-primary'
                }`}
              >
                {rating}+
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}