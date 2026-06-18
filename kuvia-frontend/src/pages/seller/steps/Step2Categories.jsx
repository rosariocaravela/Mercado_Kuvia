import { useStoreCreation } from '../../../context/StoreCreationContext';
import WizardProgress from '../components/wizard/WizardProgress';
import CategoryCard from '../components/wizard/CategoryCard';
const CATEGORIES = [
  { id: 'electronics', label: 'Eletrónicos', icon: 'devices' },
  { id: 'fashion', label: 'Moda & Vestuário', icon: 'apparel' },
  { id: 'beauty', label: 'Beleza & Cuidado', icon: 'content_cut' },
  { id: 'food', label: 'Alimentação', icon: 'restaurant' },
  { id: 'home', label: 'Casa & Decoração', icon: 'chair' },
  { id: 'services', label: 'Serviços', icon: 'handyman' },
  { id: 'sports', label: 'Desporto & Lazer', icon: 'sports' },
  { id: 'books', label: 'Livros & Papelaria', icon: 'menu_book' },
];

export default function Step2Categories({ onNext, onBack }) {
  const { storeData, toggleCategory, errors, validateStep } = useStoreCreation();

  const handleContinue = () => { if (validateStep(2)) onNext(); };

  return (
    <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <WizardProgress currentStep={2} />
      
      <div className="text-center mb-10">
        <h1 className="font-headline-lg text-ink-black mb-3">O que você vai vender?</h1>
        <p className="font-body-md text-ink-gray">Seleccione as categorias que melhor descrevem os seus produtos.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10">
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} icon={cat.icon} label={cat.label}
            selected={storeData.categories.includes(cat.id)}
            onClick={() => toggleCategory(cat.id)} />
        ))}
      </div>
      
      {errors.categories && <p className="text-error text-sm font-body-sm text-center mb-6">{errors.categories}</p>}

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <button type="button" onClick={onBack} className="w-full md:w-auto px-8 py-3 border border-border-light rounded-xl font-label-md text-ink-gray hover:bg-surface-container-low transition-colors order-2 md:order-1">Voltar</button>
        <button type="button" onClick={handleContinue} className="w-full md:w-auto px-10 py-3 bg-primary text-on-primary rounded-xl font-label-md hover:bg-primary-container shadow-sm hover:shadow-md transition-all order-1 md:order-2 flex items-center justify-center gap-2">
          Continuar<span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}