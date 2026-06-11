/**
 * Converte texto em slug URL-friendly para Moçambique
 * Ex: "Boutique Elegância" → "boutique-elegancia"
 */
export const slugify = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')                    // Separar acentos
    .replace(/[\u0300-\u036f]/g, '')    // Remover acentos
    .replace(/[^a-z0-9]+/g, '-')        // Substituir não-alfanuméricos por hífen
    .replace(/^-+|-+$/g, '')            // Remover hífens das extremidades
    .slice(0, 50);                      // Limitar tamanho
};

/**
 * Valida se um slug está disponível (chama API)
 */
export const validateSlug = async (slug) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/stores/check-slug?slug=${slug}`);
    const data = await response.json();
    return data.available;
  } catch {
    return true; // Assume disponível em caso de erro de rede
  }
};