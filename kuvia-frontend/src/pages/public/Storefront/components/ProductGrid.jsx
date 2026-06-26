import ProductCard from './ProductCard';

/**
 * Grid de produtos da loja
 */
export default function ProductGrid({ products = [], storeName, storeWhatsapp }) {
  if (!products || products.length === 0) {
    return (
      <div className="px-margin-page py-16 text-center">
        <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-4xl text-outline-variant">
            inventory_2
          </span>
        </div>
        <h3 className="font-headline-md text-ink-black mb-2">
          Nenhum produto disponível
        </h3>
        <p className="font-body-md text-on-surface-variant">
          Este vendedor ainda não adicionou produtos à loja.
        </p>
      </div>
    );
  }

  return (
    <section className="px-margin-page pb-24">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            storeName={storeName}
            storeWhatsapp={storeWhatsapp}
          />
        ))}
      </div>
    </section>
  );
}