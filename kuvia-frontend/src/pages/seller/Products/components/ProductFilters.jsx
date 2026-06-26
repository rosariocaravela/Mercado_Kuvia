import { useState, useEffect } from 'react';

export default function ProductFilters({ filters, onFilterChange, onClear }) {
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFilterChange({ ...filters, search: localSearch, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Pesquisa */}
      <div className="relative flex-1">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
          search
        </span>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Pesquisar produtos..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-light focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body-sm"
        />
      </div>

      {/* Filtro de Status */}
      <select
        value={filters.status || 'all'}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value, page: 1 })}
        className="px-4 py-3 rounded-xl border border-border-light focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body-sm bg-background-surface"
      >
        <option value="all">Todos os estados</option>
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
        <option value="low_stock">Stock baixo</option>
      </select>

      {/* Ordenação */}
      <select
        value={filters.sort || 'newest'}
        onChange={(e) => onFilterChange({ ...filters, sort: e.target.value, page: 1 })}
        className="px-4 py-3 rounded-xl border border-border-light focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body-sm bg-background-surface"
      >
        <option value="newest">Mais recentes</option>
        <option value="oldest">Mais antigos</option>
        <option value="price_asc">Preço: menor → maior</option>
        <option value="price_desc">Preço: maior → menor</option>
        <option value="most_viewed">Mais vistos</option>
      </select>

      {/* Limpar Filtros */}
      {(filters.search || filters.status || filters.sort) && (
        <button
          onClick={onClear}
          className="px-4 py-3 rounded-xl border border-border-light text-primary font-label-sm hover:bg-primary/5 transition-colors"
        >
          Limpar
        </button>
      )}
    </div>
  );
}