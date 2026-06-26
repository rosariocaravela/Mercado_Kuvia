import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { storeService } from '../../../services/storeService';
import StoreHeader from './components/StoreHeader';
import SearchFilterBar from './components/SearchFilterBar';
import ProductGrid from './components/ProductGrid';
import WhatsAppButton from '../../../components/common/WhatsAppButton';

export default function Storefront() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar dados da loja e produtos
  useEffect(() => {
    const loadStoreData = async () => {
      try {
        setLoading(true);
        setError(null);


        // Buscar loja e produtos em paralelo
        const [storeResponse, productsResponse] = await Promise.all([
          storeService.getStoreBySlug(slug),
          storeService.getStoreProducts(slug, { limit: 100 })
        ]);

        if (storeResponse.success) {
          setStore(storeResponse.data);
        } else {
          throw new Error(storeResponse.message || 'Loja não encontrada');
        }

        if (productsResponse.success) {
          const productsList = productsResponse.data?.products || productsResponse.data || [];
          setProducts(productsList);
          setFilteredProducts(productsList);

          // Extrair categorias únicas dos produtos
          const uniqueCategories = [...new Set(
            productsList
              .map(p => p.category?.name)
              .filter(Boolean)
          )].map(name => ({ name }));
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error('Erro ao carregar loja:', err);
        setError(err.message || 'Erro ao carregar dados da loja');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadStoreData();
    }
  }, [slug]);

  // Handler para filtros
  const handleFilterChange = ({ search, category }) => {
    let filtered = [...products];

    // Filtro por pesquisa
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por categoria
    if (category && category !== 'all') {
      filtered = filtered.filter(p =>
        p.category?.name === category ||
        p.category?.id === category
      );
    }

    setFilteredProducts(filtered);
  };

  // Estado de loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-subtle">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body-md text-ink-gray">A carregar loja...</p>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-subtle px-margin-page">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-error-container rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-4xl text-error">
              store
            </span>
          </div>
          <h2 className="font-headline-lg text-ink-black mb-3">
            Loja não encontrada
          </h2>
          <p className="font-body-md text-on-surface-variant mb-6">
            {error || 'Esta loja não existe ou foi removida.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/"
              className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 transition-all"
            >
              Voltar ao Início
            </Link>
            <Link
              to="/explore"
              className="px-6 py-2.5 bg-background-surface border border-border-light rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-low transition-all"
            >
              Explorar Lojas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-subtle">
      {/* Header Kuvia */}
      <header className="bg-background-surface border-b border-border-light sticky top-0 z-40">
        <div className="flex justify-between items-center w-full px-margin-page max-w-container-max mx-auto h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined font-bold">bolt</span>
            </div>
            <span className="font-headline-md text-headline-md font-bold text-ink-black">
              Kuvia
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to={`/store/${slug}`}
              className="text-primary border-b-2 border-primary pb-1 font-label-md text-label-md"
            >
              Loja
            </Link>
            <Link
              to="/explore"
              className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md"
            >
              Explorar
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="hidden md:block font-label-md text-label-md text-primary hover:opacity-80 px-4 py-2"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-primary-container text-on-primary-container font-label-md text-label-md px-5 py-2.5 rounded-full hover:shadow-lg transition-all active:scale-95"
            >
              Criar Loja
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-container-max mx-auto">
        {/* Cabeçalho da Loja */}
        <StoreHeader store={store} />

        {/* Pesquisa e Filtros */}
        <SearchFilterBar
          categories={categories}
          onFilterChange={handleFilterChange}
        />

        {/* Grid de Produtos */}
        <ProductGrid
          products={filteredProducts}
          storeName={store.name}
          storeWhatsapp={store.whatsapp_number}
        />
      </main>

      {/* Botão WhatsApp Flutuante */}
      <WhatsAppButton
        phone={store.whatsapp_number}
        storeName={store.name}
      />

      {/* Footer */}
      <footer className="w-full border-t border-border-light bg-background-surface mt-12 mb-20 md:mb-0">
        <div className="w-full px-margin-page max-w-container-max mx-auto py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <span className="font-headline-md text-headline-md font-bold text-ink-black mb-2 block">
              Kuvia
            </span>
            <p className="text-ink-gray font-body-sm max-w-sm">
              © 2024 Kuvia Moçambique. Construindo o futuro do comércio local.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/termos" className="text-ink-gray hover:text-primary transition-colors underline font-label-sm text-label-sm">
              Termos
            </Link>
            <Link to="/privacidade" className="text-ink-gray hover:text-primary transition-colors underline font-label-sm text-label-sm">
              Privacidade
            </Link>
            <Link to="/suporte" className="text-ink-gray hover:text-primary transition-colors underline font-label-sm text-label-sm">
              Suporte
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}