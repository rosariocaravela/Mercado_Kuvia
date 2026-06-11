import { useState, useRef } from 'react';

export default function ImageUpload({ label, hint, onImageSelect, previewUrl, accept = "image/*" }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    
    // Validar tipo e tamanho
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas imagens');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('Imagem muito grande. Máximo 5MB');
      return;
    }
    
    // Criar preview URL
    const preview = URL.createObjectURL(file);
    onImageSelect(file, preview);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div className="space-y-3">
      <label className="font-label-md text-on-surface">{label}</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-outline-variant bg-background-subtle hover:bg-surface-container-low'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-20 h-20 object-cover rounded-lg border border-border-light"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onImageSelect(null, null);
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-error text-on-error rounded-full flex items-center justify-center hover:bg-error/90"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-primary">
                {label.includes('Logo') ? 'add_a_photo' : 'landscape'}
              </span>
            </div>
            <span className="font-label-sm text-primary">Upload {label.split(' ')[0]}</span>
            <span className="font-body-sm text-on-surface-variant mt-1">{hint}</span>
          </>
        )}
      </div>
    </div>
  );
}