import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../../utils/formatters';

export default function ProductGrid({ products, storeName }) {
  if (products.length === 0) {
    return <div className="text-center py-12 text-on-surface-variant">Nenhum produto disponível nesta loja.</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => {
        const primaryImage = product.images?.find(img => img.is_primary)?.url;
        return (
          <Link key={product.id} to={`/store/${storeName.toLowerCase().replace(/\s+/g, '-')}/${product.slug}`} 
            className="bg-background-surface rounded-xl border border-border-light overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="aspect-square bg-surface-container flex items-center justify-center">
              {primaryImage ? (
                <img src={primaryImage} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <span className="material-symbols-outlined text-outline-variant text-3xl">image</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-label-md text-ink-black truncate">{product.title}</h3>
              <p className="font-body-md text-primary font-semibold mt-1">{formatCurrency(product.price, product.currency)}</p>
              {product.condition !== 'NOVO' && <span className="text-xs text-on-surface-variant">{product.condition.replace('_', ' ')}</span>}
            </div>
          </Link>
        );
      })}
    </div>
  );
}