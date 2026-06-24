/**
 * Converte texto em slug URL-friendly para Moçambique
 * Ex: "Boutique Elegância" → "boutique-elegancia"
 */
export const slugify = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
};

/**
 * Valida formato de slug
 */
export const isValidSlug = (slug) => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};

/**
 * Valida disponibilidade de slug via API
 */
export const checkSlugAvailability = async (slug) => {
  try {
    const base = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || `${window.location.origin}/api`;
    const url = `${base.replace(/\/$/, '')}/stores/slug/check?slug=${encodeURIComponent(slug)}`;
    const response = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    const data = await response.json();
    return data.available;
  } catch {
    return true;
  }
};