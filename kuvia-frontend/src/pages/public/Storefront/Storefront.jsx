import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { storeService } from '../../../services/storeService';
import { generateWhatsAppLink } from '../../../utils/whatsappLink';
import StoreHeader from './StoreHeader';
import ProductGrid from './components/ProductGrid';
import WhatsAppButton from '../../../components/common/WhatsAppButton';

export default function Storefront() {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [storeRes, productsRes] = await Promise.all([
          storeService.getStoreBySlug(slug),
          storeService.getStoreProducts(slug, { limit: 20 })
        ]);
        if (storeRes.success) setStore(storeRes.data);
        if (productsRes.success) setProducts(productsRes.data.products);
      } catch (err) {
        setError(err.message || 'Erro ao carregar loja');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (error || !store) return <Navigate to="/404" replace />;

  return (
    <div className="min-h-screen bg-background-subtle">
      <StoreHeader store={store} />
      
      <main className="max-w-container-max mx-auto px-margin-page py-8">
        <div className="mb-8">
          <h2 className="font-headline-md text-ink-black mb-4">Produtos</h2>
          <ProductGrid products={products} storeName={store.name} />
        </div>
      </main>

      {store.whatsapp_number && (
        <WhatsAppButton phone={store.whatsapp_number} storeName={store.name} />
      )}
    </div>
  );
}