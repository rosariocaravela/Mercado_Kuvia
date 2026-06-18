/**
 * Converte texto em slug URL-friendly para Moçambique
 * Ex: "Boutique Elegância" → "boutique-elegancia"
 * @param {string} text - Texto a converter
 * @returns {string} Slug formatado
 */
const slugify = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')                    // Separar acentos (NFD = Normalization Form Decomposed)
    .replace(/[\u0300-\u036f]/g, '')    // Remover acentos diacríticos
    .replace(/[^a-z0-9]+/g, '-')        // Substituir não-alfanuméricos por hífen
    .replace(/^-+|-+$/g, '')            // Remover hífens das extremidades
    .slice(0, 50);                      // Limitar a 50 caracteres para URLs limpos
};

/**
 * Valida formato de slug: apenas letras minúsculas, números e hífens
 * @param {string} slug 
 * @returns {boolean}
 */
const isValidSlug = (slug) => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};

module.exports = { slugify, isValidSlug };