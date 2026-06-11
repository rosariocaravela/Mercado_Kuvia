export default function WizardProgress({ currentStep, totalSteps = 3 }) {
  const progress = (currentStep / totalSteps) * 100;
  const stepLabels = ['Configuração', 'Categorias', 'Personalização'];
  
  return (
    <div className="mb-10">
      <div className="flex justify-between items-end mb-3">
        <div>
          <p className="font-label-sm text-primary uppercase tracking-wider mb-1">
            Passo {currentStep} de {totalSteps}
          </p>
          <h2 className="font-headline-md text-headline-md text-ink-black">
            {stepLabels[currentStep - 1]}
          </h2>
        </div>
        <span className="font-label-md text-on-surface-variant">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}