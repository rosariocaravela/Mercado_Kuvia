import { formatCurrency } from '../../../../utils/formatters';
import WhatsAppButton from '../../../../components/common/WhatsAppButton';
import { getImageUrl } from '../../../../utils/imageUrl';

/**
 * Card individual de produto
 */
export default function ProductCard({ product, storeName, storeWhatsapp }) {
  // Obter imagem principal
  const mainImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const imageUrl = getImageUrl(mainImage?.url || mainImage?.imageUrl);
  
  // Estado do produto
  const isAvailable = product.stock > 0 && product.isActive !== false;

    const handleOrder = () => {
      // Abre WhatsApp com mensagem pré-preenchida
      const message = `Olá! Tenho interesse no produto "${product.name}" (${formatCurrency(product.price)}) da sua loja ${storeName}. Está disponível?`;
    const phone = storeWhatsapp.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-background-surface border border-border-light rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
      {/* Imagem */}
      <div className="aspect-square w-full relative overflow-hidden bg-surface-container-lowest">
        {imageUrl ? (
          <img
            src={imageUrl}
              alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
             onError={(e) => {
              console.error('Erro ao carregar imagem do produto:', imageUrl);
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-low">
            <span className="material-symbols-outlined text-5xl text-outline-variant">
              image
            </span>
          </div>
        )}

        {/* Badge de disponibilidade */}
        <div className="absolute top-2 right-2">
          <span className={`
            ${isAvailable ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'}
            text-[10px] md:text-label-sm font-label-md px-2 py-1 rounded-full flex items-center gap-1
          `}>
            <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-secondary' : 'bg-error'}`}></span>
            {isAvailable ? 'Disponível' : 'Esgotado'}
          </span>
        </div>
      </div>

      {/* Informações */}
      <div className="p-4">
        <h3 className="font-label-md text-ink-black mb-1 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-primary font-headline-md text-[18px] mb-4">
          {formatCurrency(product.price)}
        </p>

        <button
          onClick={handleOrder}
          disabled={!isAvailable}
          className="w-full bg-background-subtle border border-border-light text-ink-black py-2 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-2 hover:bg-secondary-container hover:border-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
          {isAvailable ? 'Encomendar' : 'Indisponível'}
        </button>
      </div>
    </div>
  );
}