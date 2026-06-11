import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreCreationProvider, useStoreCreation } from '../../context/StoreCreationContext';
import Step1StoreName from './steps/Step1StoreName';
import Step2Categories from './steps/Step2Categories';
import Step3Branding from './steps/Step3Branding';

// Componente interno que usa o context
function WizardContent() {
  const { currentStep, updateStep, reset } = useStoreCreation();
  const navigate = useNavigate();

  const handleComplete = (store) => {
    reset(); // Limpar estado para próxima criação
    navigate(`/seller/dashboard?store=${store.slug}`, { 
      state: { message: 'Loja criada com sucesso!' } 
    });
  };

  const handleExit = () => {
    if (window.confirm('Tem certeza que deseja sair? O progresso será perdido.')) {
      reset();
      navigate('/seller/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background-subtle flex flex-col">
      {/* Header Simplificado */}
      <header className="bg-background-surface border-b border-border-light h-16 flex items-center px-margin-page sticky top-0 z-50">
        <div className="max-w-container-max mx-auto w-full flex justify-between items-center">
          <span className="font-headline-md font-bold text-ink-black">Kuvia</span>
          <button 
            onClick={handleExit}
            className="text-ink-gray font-label-md hover:text-primary transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        {currentStep === 1 && (
          <Step1StoreName 
            onNext={() => updateStep(2)} 
            onBack={() => navigate('/seller/dashboard')} 
          />
        )}
        {currentStep === 2 && (
          <Step2Categories 
            onNext={() => updateStep(3)} 
            onBack={() => updateStep(1)} 
          />
        )}
        {currentStep === 3 && (
          <Step3Branding 
            onComplete={handleComplete} 
            onBack={() => updateStep(2)} 
          />
        )}
      </main>

      {/* Footer Minimalista */}
      <footer className="w-full py-6 px-margin-page border-t border-border-light bg-background-surface">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body-sm text-on-surface-variant">
            © 2024 Kuvia Moçambique. Construindo o futuro do comércio local.
          </p>
          <div className="flex gap-6">
            <a href="/termos" className="font-label-sm text-ink-gray hover:text-primary transition-colors">Termos</a>
            <a href="/privacidade" className="font-label-sm text-ink-gray hover:text-primary transition-colors">Privacidade</a>
            <a href="/suporte" className="font-label-sm text-ink-gray hover:text-primary transition-colors">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Export com Provider
export default function CreateStoreWizard() {
  return (
    <StoreCreationProvider>
      <WizardContent />
    </StoreCreationProvider>
  );
}