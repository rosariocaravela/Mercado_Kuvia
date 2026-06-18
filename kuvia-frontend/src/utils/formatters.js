export const formatCurrency = (value, currency = 'MZN') => {
  if (value == null || isNaN(Number(value))) return '';

  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
};
