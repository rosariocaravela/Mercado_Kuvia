import { useState, useEffect } from 'react';
import { storeService } from './../services/storeService';
import { useSearchParams } from 'react-router-dom';

export function useExploreStores() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categories: searchParams.get('categories')?.split(',') || [],
    province: searchParams.get('province') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
  });

  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    count: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page: filters.page,
          limit: filters.limit,
        };

        if (filters.search) params.search = filters.search;
        if (filters.categories.length) params.categories = filters.categories.join(',');
        if (filters.province) params.province = filters.province;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.minRating) params.minRating = filters.minRating;

        const response = await storeService.searchStores(params);

        if (!response.success) throw new Error(response.message);

        setStores(response.data.stores || []);
        setPagination({
          page: response.data.page,
          totalPages: response.data.totalPages,
          count: response.data.count
        });

      } catch (err) {
        setError(err.message);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();

    // URL sync
    const newParams = new URLSearchParams();
    if (filters.search) newParams.set('search', filters.search);
    if (filters.categories.length) newParams.set('categories', filters.categories.join(','));
    if (filters.province) newParams.set('province', filters.province);
    if (filters.page > 1) newParams.set('page', filters.page);

    setSearchParams(newParams, { replace: true });

  }, [filters]);

  return {
    filters,
    setFilters,
    stores,
    pagination,
    loading,
    error,
  };
}