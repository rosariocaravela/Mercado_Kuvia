import { useEffect } from 'react';
import { useStoreCreation } from '../../../context/StoreCreationContext';
import { slugify } from '../../../utils/slugify';
import WizardProgress from '../components/wizard/WizardProgress';

export default function Step1StoreName({ onNext, onBack }) {
  const { storeData, updateStoreData, errors, slugAvailable, validateStep } = useStoreCreation();

  const handleNameChange = (e) => {
    const name = e.target.value;
    updateStoreData('name', name);
    updateStoreData('slug', slugify(name));
  };

  // ✅ NOVO: Handler para WhatsApp com formatação automática
  const handleWhatsAppChange = (e) => {
    let value = e.target.value;

    // Permitir apenas números, espaços, + e -
    value = value.replace(/[^\d+\-\s]/g, '');

    updateStoreData('whatsapp', value);
  };

  const handleContinue = () => { if (validateStep(1)) onNext(); };

  useEffect(() => { document.getElementById('store_name')?.focus(); }, []);

  return (
    <div className="w-full max-w-[560px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <WizardProgress currentStep={1} />

      <div className="bg-background-surface border border-border-light rounded-xl shadow-sm p-8 md:p-10">
        <div className="mb-8">
          <h1 className="font-headline-lg text-ink-black mb-3">Vamos dar um nome à sua loja</h1>
          <p className="font-body-md text-on-surface-variant">Este será o nome público da sua marca.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-8">
          <div className="space-y-2">
            <label className="font-label-md text-ink-black block" htmlFor="store_name">Nome da Loja *</label>
            <div className="relative">
              <input id="store_name" type="text" value={storeData.name} onChange={handleNameChange}
                placeholder="Ex: Boutique Elegância"
                className={`w-full px-4 py-4 rounded-lg border transition-all outline-none font-body-md text-ink-black placeholder:text-outline-variant
                  ${errors.name ? 'border-error focus:border-error focus:ring-2 focus:ring-error/10' : 'border-border-light focus:border-primary focus:ring-2 focus:ring-primary/10'}`} />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant">
                <span className="material-symbols-outlined">store</span>
              </div>
            </div>
            {errors.name && <p className="text-error text-sm font-body-sm flex items-center gap-1"><span className="material-symbols-outlined text-xs">error</span>{errors.name}</p>}
            {!slugAvailable && storeData.slug && <p className="text-error text-sm">Este URL já está em uso</p>}
          </div>

          {/* ✅ NOVO: Input WhatsApp */}
          <div className="space-y-2">
            <label className="font-label-md text-ink-black block" htmlFor="whatsapp">
              <span className="flex items-center gap-2">
                <span className="text-[#25D366]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </span>
                WhatsApp da Loja *
              </span>
            </label>
            <div className="relative">
              <input
                id="whatsapp"
                type="tel"
                value={storeData.whatsapp}
                onChange={handleWhatsAppChange}
                placeholder="+258 84 123 4567"
                className={`w-full px-4 py-4 pl-12 rounded-lg border transition-all outline-none font-body-md text-ink-black placeholder:text-outline-variant
                  ${errors.whatsapp
                    ? 'border-error focus:border-error focus:ring-2 focus:ring-error/10'
                    : 'border-border-light focus:border-primary focus:ring-2 focus:ring-primary/10'
                  }`}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#25D366]">
                <span className="material-symbols-outlined">call</span>
              </div>
            </div>
            {errors.whatsapp ? (
              <p className="text-error text-sm font-body-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">error</span>
                {errors.whatsapp}
              </p>
            ) : (
              <p className="text-on-surface-variant text-xs font-body-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">info</span>
                Os clientes contactarão a sua loja por este número
              </p>
            )}
          </div>

          <div className={`bg-background-subtle border rounded-lg p-5 flex items-start gap-4 transition-all ${storeData.name ? 'border-primary/30 ring-2 ring-primary/20' : 'border-border-light'}`}>
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
            </div>
            <div>
              <p className="font-label-sm text-on-surface-variant mb-1">O seu link personalizado:</p>
              <p className="font-body-md font-semibold text-primary break-all">
                kuvia.co.mz/<span className="text-primary underline decoration-primary/30">{storeData.slug || 'nome-da-loja'}</span>
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col md:flex-row gap-4">
            <button type="submit" className="w-full md:flex-1 bg-primary text-on-primary py-4 px-8 rounded-lg font-label-md hover:bg-primary-container transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              <span>Continuar</span><span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button type="button" onClick={onBack} className="w-full md:w-auto text-ink-gray font-label-md py-4 px-8 hover:bg-surface-container-low rounded-lg transition-colors">Voltar</button>
          </div>
        </form>
      </div>
    </div>
  );
}