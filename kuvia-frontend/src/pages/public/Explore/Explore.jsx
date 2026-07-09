import { useExploreStores } from './../../../hooks/useExploreStores';

import ExploreSidebar from './components/ExploreSidebar';
import ExploreStoreCard from './components/ExploreStoreCard';
import ExplorePagination from './components/ExplorePagination';
import Footer from './components/ExploreFooter';
import Header from './components/ExploreHeader';

export default function ExplorePage() {
  const {
    filters,
    setFilters,
    stores,
    pagination,
    loading,
    error
  } = useExploreStores();

  return (
    <div className="min-h-screen bg-background-subtle">
      <Header />

      <main className="pt-16 pb-24 md:pb-12">
        <div className="max-w-container-max mx-auto px-margin-page flex gap-8 mt-8">

          {/* Sidebar */}
          <ExploreSidebar
            filters={filters}
            onFilterChange={setFilters}
            onClear={() => setFilters({
              search: '',
              categories: [],
              province: '',
              minPrice: '',
              maxPrice: '',
              minRating: '',
              page: 1,
              limit: 12,
            })}
          />

          {/* Conteúdo */}
          <section className="flex-1">

            <h1 className="text-2xl font-bold mb-4">
              Descobrir Lojas
            </h1>

            {/* Loading */}
            {loading && <p>A carregar...</p>}

            {/* Error */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map(store => (
                <ExploreStoreCard key={store.id} store={store} />
              ))}
            </div>

            {/* Paginação */}
            <ExplorePagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(page) =>
                setFilters(prev => ({ ...prev, page }))
              }
            />

          </section>
        </div>
      </main>
      {/* FOOTER AQUI */}
      <Footer />
    </div>
  );
}