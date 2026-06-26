import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../../services/productService';
import ProductCard from './components/ProductCard';
import ProductFilters from './components/ProductFilters';

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, count: 0 });
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sort: 'newest',
    page: 1,
    limit: 12
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.getMyProducts(filters);
      
      if (response.success) {
        setProducts(response.data.products || []);
        setPagination({
          page: response.data.page || 1,
          totalPages: response.data.totalPages || 1,
          count: response.data.count || 0
        });
      } else {
        throw new Error(response.message || 'Erro ao carregar produtos');
      }
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setError(err.message || 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      sort: 'newest',
      page: 1,
      limit: 12
    });
  };

  const handleEdit = (product) => {
    navigate(`/seller/products/${product.id}/edit`);
  };

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      console.error('Erro ao eliminar produto:', err);
      alert('Erro ao eliminar produto');
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      await productService.toggleProductStatus(id, isActive);
      await fetchProducts();
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      alert('Erro ao alterar status do produto');
    }
  };

  return (
    <div className="px-margin-page py-8 max-w-container-max mx-auto w-full">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-ink-black">
            Meus Produtos
          </h1>
          <p className="font-body-md text-on-surface-variant">
            {loading 
              ? 'A carregar produtos...' 
              : `${pagination.count} ${pagination.count === 1 ? 'produto' : 'produtos'} na tua loja`
            }
          </p>
        </div>
        <button
          onClick={() => navigate('/seller/products/new')}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-label-md shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Adicionar Produto
        </button>
      </div>

      {/* Filtros */}
      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* Estado de Loading */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-background-surface rounded-xl border border-border-light overflow-hidden animate-pulse">
              <div className="aspect-square bg-surface-container-low"></div>
              <div className="p-4">
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
          <h3 className="font-headline-md text-ink-black mb-2">Erro ao carregar produtos</h3>
          <p className="font-body-md text-on-surface-variant mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-md hover:opacity-90 transition-all"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Estado Vazio */}
      {!loading && !error && products.length === 0 && (
        <div className="bg-background-surface border border-border-light rounded-2xl p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">
            inventory_2
          </span>
          <h3 className="font-headline-md text-ink-black mb-2">
            {filters.search || filters.status !== 'all' 
              ? 'Nenhum produto encontrado' 
              : 'Ainda não tens produtos'}
          </h3>
          <p className="font-body-md text-on-surface-variant mb-6">
            {filters.search || filters.status !== 'all'
              ? 'Tenta ajustar os filtros ou pesquisa por outro termo.'
              : 'Adiciona o teu primeiro produto para começar a vender!'}
          </p>
          <button
            onClick={() => navigate('/seller/products/new')}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-md hover:opacity-90 transition-all inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Adicionar Primeiro Produto
          </button>
        </div>
      )}

      {/* Grid de Produtos */}
      {!loading && !error && products.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-4">
              <button
                onClick={() => handleFilterChange({ ...filters, page: filters.page - 1 })}
                disabled={filters.page === 1}
                className="px-4 py-2 rounded-lg border border-border-light text-on-surface-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="font-body-sm text-on-surface-variant">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => handleFilterChange({ ...filters, page: filters.page + 1 })}
                disabled={filters.page === pagination.totalPages}
                className="px-4 py-2 rounded-lg border border-border-light text-on-surface-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Próximo
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}