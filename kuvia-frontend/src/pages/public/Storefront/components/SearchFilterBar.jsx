import { useState } from 'react';

/**
 * Barra de pesquisa e filtros de categoria
 */
export default function SearchFilterBar({ categories = [], onFilterChange }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ search: value, category: activeCategory });
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    onFilterChange({ search, category: categoryId });
  };

  return (
    <section className="px-margin-page mb-10">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Campo de Pesquisa */}
        <div className="relative w-full md:max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Pesquisar produtos..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-light focus:ring-primary focus:border-primary bg-background-surface font-body-sm outline-none transition-all"
          />
        </div>

        {/* Filtros de Categoria */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {/* Todos */}
          <button
            onClick={() => handleCategoryClick('all')}
            className={`${
              activeCategory === 'all'
                ? 'bg-primary text-on-primary'
                : 'bg-background-surface border border-border-light text-on-surface-variant hover:border-primary hover:text-primary'
            } px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-all`}
          >
            Todos
          </button>

          {/* Categorias dinâmicas */}
          {categories.map((category) => (
            <button
              key={category.id || category}
              onClick={() => handleCategoryClick(category.id || category)}
              className={`${
                activeCategory === (category.id || category)
                  ? 'bg-primary text-on-primary'
                  : 'bg-background-surface border border-border-light text-on-surface-variant hover:border-primary hover:text-primary'
              } px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-all`}
            >
              {category.name || category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}