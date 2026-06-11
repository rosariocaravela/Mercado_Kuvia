import { createContext, useContext, useState, useCallback } from 'react';

const StoreCreationContext = createContext();

export const useStoreCreation = () => {
  const context = useContext(StoreCreationContext);
  if (!context) {
    throw new Error('useStoreCreation must be used within StoreCreationProvider');
  }
  return context;
};

export const StoreCreationProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [storeData, setStoreData] = useState({
    name: '',
    slug: '',
    categories: [],
    logo: null,
    banner: null,
    whatsapp: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateStep = useCallback((step) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const updateStoreData = useCallback((field, value) => {
    setStoreData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao editar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const addCategory = useCallback((category) => {
    setStoreData(prev => {
      if (prev.categories.includes(category)) {
        return prev; // Já existe
      }
      return { ...prev, categories: [...prev.categories, category] };
    });
  }, []);

  const removeCategory = useCallback((category) => {
    setStoreData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  }, []);

  const validateStep = useCallback((step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!storeData.name?.trim()) {
        newErrors.name = 'O nome da loja é obrigatório';
      }
      if (storeData.name?.trim().length < 3) {
        newErrors.name = 'Mínimo de 3 caracteres';
      }
    }
    
    if (step === 2) {
      if (storeData.categories.length === 0) {
        newErrors.categories = 'Selecione pelo menos uma categoria';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [storeData]);

  const reset = useCallback(() => {
    setCurrentStep(1);
    setStoreData({
      name: '', slug: '', categories: [], logo: null, banner: null, whatsapp: '', description: ''
    });
    setErrors({});
  }, []);

  const value = {
    currentStep,
    storeData,
    errors,
    isSubmitting,
    updateStep,
    updateStoreData,
    addCategory,
    removeCategory,
    validateStep,
    setIsSubmitting,
    reset
  };

  return (
    <StoreCreationContext.Provider value={value}>
      {children}
    </StoreCreationContext.Provider>
  );
};