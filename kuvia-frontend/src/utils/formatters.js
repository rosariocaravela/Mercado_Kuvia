/**
 * Formata valor em Meticais Moçambicanos (MT)
 * Ex: 45000 → "45.000 MT"
 */
export const formatCurrency = (value, currency = 'MZN') => {
  if (value === null || value === undefined) return '0 MT';
  
  const number = Number(value);
  if (isNaN(number)) return '0 MT';

  // Formatar com separadores de milhares
  const formatted = number.toLocaleString('pt-MZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  return `${formatted} MT`;
};

/**
 * Formata data relativa (ex: "há 2 dias")
 */
export const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays} dias`;
  if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
  return date.toLocaleDateString('pt-MZ');
};