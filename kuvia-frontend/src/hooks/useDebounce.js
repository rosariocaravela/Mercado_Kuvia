import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores (útil em pesquisas)
 * Uso: const debouncedSearch = useDebounce(searchTerm, 500);
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;