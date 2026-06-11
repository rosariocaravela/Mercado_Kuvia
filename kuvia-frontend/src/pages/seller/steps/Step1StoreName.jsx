import { useEffect } from 'react';
import { useStoreCreation } from '../../../context/StoreCreationContext';
import { slugify } from '../../../utils/slugify';
import WizardProgress from '../../../components/wizard/WizardProgress';

export default function Step1StoreName({ onNext, onBack }) {
  const { storeData, updateStoreData, errors, validateStep } = useStoreCreation();
  
  const handleNameChange = (e) => {
    const name = e.target.value;
    updateStoreData('name', name);
    updateStoreData('slug', slugify(name));
  };

  const handleContinue = () => {
    if (validateStep(1)) {
      onNext();
    }
  };

  useEffect(() => {
    // Auto-focus no input ao montar
    document.getElementById('store_name')?.focus();
  }, []);

  return (
    <div className="w-full max-w-[560px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <WizardProgress currentStep={1} />
      
      <div className="bg-background-surface border border-border-light rounded-xl shadow-sm p-8 md:p-10">
        <div className="mb-8">
          <h1 className="font-headline-lg text-ink-black mb-3">Vamos dar um nome à sua loja</h1>
          <p className="font-body-md text-on-surface-variant">
            Este será o nome público da sua marca. Não se preocupe, você poderá alterá-lo mais tarde.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-8">
          {/* Input Nome da Loja */}
          <div className="space-y-2">
            <label className="font-label-md text-ink-black block" htmlFor="store_name">
              Nome da Loja *
            </label>
            <div className="relative">
              <input
                id="store_name"
                type="text"
                value={storeData.name}
                onChange={handleNameChange}
                placeholder="Ex: Boutique Elegância"
                className={`
                  w-full px-4 py-4 rounded-lg border transition-all outline-none font-body-md text-ink-black placeholder:text-outline-variant
                  ${errors.name 
                    ? 'border-error focus:border-error focus:ring-2 focus:ring-error/10' 
                    : 'border-border-light focus:border-primary focus:ring-2 focus:ring-primary/10'
                  }
                `}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant">
                <span className="material-symbols-outlined">store</span>
              </div>
            </div>
            {errors.name && (
              <p className="text-error text-sm font-body-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">error</span>
                {errors.name}
              </p>
            )}
          </div>

          {/* Preview URL */}
          <div className={`
            bg-background-subtle border rounded-lg p-5 flex items-start gap-4 transition-all
            ${storeData.name ? 'border-primary/30 ring-2 ring-primary/20' : 'border-border-light'}
          `}>
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
            </div>
            <div>
              <p className="font-label-sm text-on-surface-variant mb-1">O seu link personalizado:</p>
              <p className="font-body-md font-semibold text-primary break-all">
                kuvia.co.mz/<span className="text-primary underline decoration-primary/30">
                  {storeData.slug || 'nome-da-loja'}
                </span>
              </p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="pt-4 flex flex-col md:flex-row gap-4">
            <button
              type="submit"
              className="w-full md:flex-1 bg-primary text-on-primary py-4 px-8 rounded-lg font-label-md hover:bg-primary-container transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Continuar</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full md:w-auto text-ink-gray font-label-md py-4 px-8 hover:bg-surface-container-low rounded-lg transition-colors"
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}