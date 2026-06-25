import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { slugify, checkSlugAvailability } from '../utils/slugify';

const StoreCreationContext = createContext();

export const useStoreCreation = () => {
  const context = useContext(StoreCreationContext);
  if (!context) throw new Error('useStoreCreation deve ser usado dentro de StoreCreationProvider');
  return context;
};

export const StoreCreationProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [storeData, setStoreData] = useState({
    name: '', slug: '', categories: [], logo: null, banner: null,
    whatsapp: '', description: '', theme: { primaryColor: '#0050cb' }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(true);

  // Actualizar slug automaticamente quando nome mudar
  useEffect(() => {
    if (!storeData.name) return;

    const newSlug = slugify(storeData.name);
    setStoreData(prev => ({ ...prev, slug: newSlug }));

    if (newSlug) {
      checkSlugAvailability(newSlug).then(setSlugAvailable);
    } else {
      setSlugAvailable(true);
    }
  }, [storeData.name]);

  const updateStep = useCallback((step) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const updateStoreData = useCallback((field, value) => {
    setStoreData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    }
  }, [errors]);

  const toggleCategory = useCallback((categoryId) => {
    setStoreData(prev => {
      const exists = prev.categories.includes(categoryId);
      return {
        ...prev, categories: exists
          ? prev.categories.filter(c => c !== categoryId)
          : [...prev.categories, categoryId]
      };
    });
  }, []);

  const validateStep = useCallback((step) => {
    const newErrors = {};
    if (step === 1) {
      if (!storeData.name?.trim()) newErrors.name = 'Nome obrigatório';
      if (storeData.name?.trim().length < 3) newErrors.name = 'Mínimo 3 caracteres';
      if (!slugAvailable) newErrors.slug = 'Este URL já está em uso';

      // ✅ NOVO: Validar WhatsApp
      if (!storeData.whatsapp?.trim()) {
        newErrors.whatsapp = 'O número WhatsApp é obrigatório';
      } else {
        // Formato Moçambique: +258 8X XXX XXXX
        const phoneClean = storeData.whatsapp.replace(/\D/g, '');
        const phoneRegex = /^(\+?258)?8[2-7]\d{7}$/;
        if (!phoneRegex.test(phoneClean)) {
          newErrors.whatsapp = 'Formato inválido. Ex: +258 84 123 4567';
        }
      }
    }
    if (step === 2 && storeData.categories.length === 0) {
      newErrors.categories = 'Seleccione pelo menos uma categoria';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [storeData, slugAvailable]);

  const reset = useCallback(() => {
    setCurrentStep(1);
    setStoreData({ name: '', slug: '', categories: [], logo: null, banner: null, whatsapp: '', description: '', theme: { primaryColor: '#0050cb' } });
    setErrors({});
    setSlugAvailable(true);
  }, []);

  return (
    <StoreCreationContext.Provider value={{
      currentStep, storeData, errors, isSubmitting, slugAvailable,
      updateStep, updateStoreData, toggleCategory, validateStep, setIsSubmitting, reset
    }}>
      {children}
    </StoreCreationContext.Provider>
  );
};