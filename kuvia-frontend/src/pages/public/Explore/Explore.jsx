import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { storeService } from '../../../services/storeService';
import ExploreSidebar from './components/ExploreSidebar';
import ExploreStoreCard from './components/ExploreStoreCard';
import ExplorePagination from './components/ExplorePagination';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Estado dos filtros
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categories: searchParams.get('categories')?.split(',') || [],
    province: searchParams.get('province') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
  });

  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar lojas quando filtros mudam
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Construir parâmetros de query
        const params = {
          page: filters.page,
          limit: filters.limit,
        };
        
        if (filters.search) params.search = filters.search;
        if (filters.categories?.length) params.categories = filters.categories.join(',');
        if (filters.province) params.province = filters.province;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.minRating) params.minRating = filters.minRating;

        const response = await storeService.searchStores(params);
        
        if (response.success) {
          setStores(response.data.stores || []);
          setPagination({
            page: response.data.page || 1,
            totalPages: response.data.totalPages || 1,
            count: response.data.count || 0,
          });
        } else {
          throw new Error(response.message || 'Erro ao carregar lojas');
        }
      } catch (err) {
        console.error('Erro ao carregar lojas:', err);
        setError(err.message || 'Erro ao carregar lojas');
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
    
    // Atualizar URL com filtros
    const newParams = new URLSearchParams();
    if (filters.search) newParams.set('search', filters.search);
    if (filters.categories?.length) newParams.set('categories', filters.categories.join(','));
    if (filters.province) newParams.set('province', filters.province);
    if (filters.page > 1) newParams.set('page', filters.page);
    
    setSearchParams(newParams, { replace: true });
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      categories: [],
      province: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      page: 1,
      limit: 12,
    });
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background-subtle">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-header border-b border-border-light">
        <div className="flex justify-between items-center w-full px-margin-page max-w-container-max mx-auto h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-headline-md text-headline-md font-bold text-ink-black">
              Kuvia
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/explore" 
                className="font-body-md text-body-md text-primary border-b-2 border-primary pb-1"
              >
                Explorar
              </Link>
              <Link 
                to="/funcionalidades" 
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200"
              >
                Funcionalidades
              </Link>
              <Link 
                to="/precos" 
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200"
              >
                Preços
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/login"
              className="hidden md:block font-label-md text-label-md text-primary hover:opacity-80 transition-soft"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-md text-label-md hover:scale-[0.98] transition-soft shadow-md"
            >
              Criar Loja
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="pt-16 pb-24 md:pb-12 min-h-screen">
        <div className="max-w-container-max mx-auto px-margin-page flex flex-col md:flex-row gap-8 mt-8">
          
          {/* Sidebar de Filtros */}
          <ExploreSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
          />

          {/* Grid de Lojas */}
          <section className="flex-1">
            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-ink-black">
                  Descobrir Lojas
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {loading 
                    ? 'A carregar lojas...' 
                    : `${pagination.count} ${pagination.count === 1 ? 'loja encontrada' : 'lojas encontradas'} em Moçambique`
                  }
                </p>
              </div>
            </div>

            {/* Estado de Loading */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-background-surface rounded-2xl border border-border-light overflow-hidden animate-pulse">
                    <div className="h-48 bg-surface-container-low"></div>
                    <div className="p-6">
                      <div className="h-4 bg-surface-container-low rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-surface-container-low rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Estado de Erro */}
            {error && !loading && (
              <div className="bg-error-container border border-error/20 rounded-xl p-8 text-center">
                <span className="material-symbols-outlined text-5xl text-error mb-4">error</span>
                <h3 className="font-headline-md text-ink-black mb-2">Erro ao carregar lojas</h3>
                <p className="font-body-md text-on-surface-variant mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-md hover:opacity-90 transition-all"
                >
                  Tentar Novamente
                </button>
              </div>
            )}

            {/* Estado Vazio */}
            {!loading && !error && stores.length === 0 && (
              <div className="bg-background-surface border border-border-light rounded-2xl p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">
                  store
                </span>
                <h3 className="font-headline-md text-ink-black mb-2">
                  Nenhuma loja encontrada
                </h3>
                <p className="font-body-md text-on-surface-variant mb-6">
                  Tenta ajustar os filtros ou pesquisa por outro termo.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-md hover:opacity-90 transition-all"
                >
                  Limpar Filtros
                </button>
              </div>
            )}

            {/* Grid de Resultados */}
            {!loading && !error && stores.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {stores.map((store) => (
                    <ExploreStoreCard key={store.id} store={store} />
                  ))}
                </div>

                {/* Paginação */}
                <ExplorePagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="hidden md:block w-full border-t border-border-light bg-background-surface">
        <div className="w-full px-margin-page max-w-container-max mx-auto py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 max-w-sm">
            <span className="font-headline-md text-headline-md font-bold text-ink-black">Kuvia</span>
            <p className="font-body-sm text-body-sm text-ink-gray">
              © 2024 Kuvia Moçambique. Construindo o futuro do comércio local.
            </p>
          </div>
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-2">
              <p className="font-label-md text-label-md text-ink-black">Plataforma</p>
              <Link to="/termos" className="font-body-sm text-body-sm text-ink-gray hover:text-primary transition-soft">Termos</Link>
              <Link to="/privacidade" className="font-body-sm text-body-sm text-ink-gray hover:text-primary transition-soft">Privacidade</Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-label-md text-label-md text-ink-black">Suporte</p>
              <a href="#" className="font-body-sm text-body-sm text-ink-gray hover:text-primary transition-soft">WhatsApp</a>
              <a href="#" className="font-body-sm text-body-sm text-ink-gray hover:text-primary transition-soft">Centro de Ajuda</a>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-label-md text-label-md text-ink-black">Siga-nos</p>
              <a href="#" className="font-body-sm text-body-sm text-ink-gray hover:text-primary transition-soft">Instagram</a>
              <a href="#" className="font-body-sm text-body-sm text-ink-gray hover:text-primary transition-soft">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}