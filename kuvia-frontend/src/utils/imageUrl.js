/**
 * Converte caminho relativo de imagem em URL absoluto
 * Ex: "/uploads/stores/logo.png" → "http://localhost:8080/uploads/stores/logo.png"
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Se já é URL absoluto (http/https), retorna como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Se é caminho relativo, adiciona base URL do backend
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
  
  // Remover "/api" do final se existir
  const base = baseUrl.replace(/\/api\/?$/, '');
  
  // Garantir que o caminho começa com /
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${base}${cleanPath}`;
};

/**
 * Converte múltiplos caminhos de imagens
 */
export const getImageUrls = (images) => {
  if (!images || !Array.isArray(images)) return [];
  return images.map(img => ({
    ...img,
    url: getImageUrl(img.url || img.imageUrl)
  }));
};