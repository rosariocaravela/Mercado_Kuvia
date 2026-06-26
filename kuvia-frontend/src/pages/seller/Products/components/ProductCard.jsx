import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../../utils/formatters';
import { getImageUrl } from '../../../../utils/imageUrl';

export default function ProductCard({ product, onEdit, onDelete, onToggleStatus }) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const mainImage = product.images?.find(img => img.isPrimary || img.is_primary) || product.images?.[0];
  const imageUrl = getImageUrl(mainImage?.url || mainImage?.imageUrl);

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      await onToggleStatus(product.id, !product.isActive);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(product.id);
    } finally {
      setLoading(false);
      setShowConfirmDelete(false);
    }
  };

  return (
    <div className="bg-background-surface border border-border-light rounded-xl overflow-hidden hover:shadow-lg transition-all group">
      {/* Imagem */}
      <div className="aspect-square w-full relative overflow-hidden bg-surface-container-lowest">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-low">
            <span className="material-symbols-outlined text-5xl text-outline-variant">image</span>
          </div>
        )}

        {/* Badge de status */}
        <div className="absolute top-2 left-2">
          <span className={`
            ${product.isActive 
              ? 'bg-secondary-container text-on-secondary-container' 
              : 'bg-error-container text-on-error-container'}
            text-[10px] font-label-md px-2 py-1 rounded-full flex items-center gap-1
          `}>
            <span className={`w-1.5 h-1.5 rounded-full ${product.isActive ? 'bg-secondary' : 'bg-error'}`}></span>
            {product.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        {/* Badge de stock baixo */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-2 right-2">
            <span className="bg-tertiary-fixed-dim text-on-tertiary-fixed-variant text-[10px] font-label-md px-2 py-1 rounded-full">
              Stock: {product.stock}
            </span>
          </div>
        )}
      </div>

      {/* Informações */}
      <div className="p-4">
        <h3 className="font-label-md text-ink-black mb-1 line-clamp-1">
          {product.title}
        </h3>
        
        <p className="text-primary font-headline-md text-[18px] mb-2">
          {formatCurrency(product.price)}
        </p>

        <div className="flex items-center gap-2 text-body-sm text-on-surface-variant mb-4">
          <span className="material-symbols-outlined text-[16px]">inventory_2</span>
          <span>Stock: {product.stock}</span>
          {product.views > 0 && (
            <>
              <span className="text-outline">•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                {product.views}
              </span>
            </>
          )}
        </div>

        {/* Acções */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 bg-surface-container-low text-primary py-2 rounded-lg font-label-sm text-label-sm hover:bg-surface-container transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            Editar
          </button>
          
          <button
            onClick={handleToggleStatus}
            disabled={loading}
            className={`px-3 py-2 rounded-lg font-label-sm text-label-sm transition-colors flex items-center justify-center ${
              product.isActive
                ? 'bg-tertiary-fixed/30 text-tertiary hover:bg-tertiary-fixed/50'
                : 'bg-secondary-container/30 text-secondary hover:bg-secondary-container/50'
            }`}
            title={product.isActive ? 'Desactivar' : 'Activar'}
          >
            <span className="material-symbols-outlined text-[16px]">
              {product.isActive ? 'visibility_off' : 'visibility'}
            </span>
          </button>

          <button
            onClick={() => setShowConfirmDelete(true)}
            disabled={loading}
            className="px-3 py-2 rounded-lg bg-error-container text-error hover:bg-error-container/70 transition-colors flex items-center justify-center"
            title="Eliminar"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>
      </div>

      {/* Modal de Confirmação de Eliminação */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-surface rounded-xl p-6 max-w-md w-full">
            <h3 className="font-headline-md text-ink-black mb-2">Eliminar Produto</h3>
            <p className="font-body-md text-on-surface-variant mb-6">
              Tens a certeza que queres eliminar "{product.title}"? Esta acção não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 bg-surface-container-low text-on-surface py-3 rounded-lg font-label-md hover:bg-surface-container transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-error text-on-error py-3 rounded-lg font-label-md hover:bg-error/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'A eliminar...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}