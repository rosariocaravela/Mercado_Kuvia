export default function CategoryCard({ icon, label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200
        ${selected 
          ? 'border-primary bg-surface-container shadow-md' 
          : 'border-border-light bg-background-surface hover:shadow-lg hover:border-primary/50'
        }
      `}
    >
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform
        ${selected ? 'bg-primary text-on-primary' : 'bg-surface-container text-primary'}
      `}>
        <span className="material-symbols-outlined text-2xl" 
              style={{ fontVariationSettings: selected ? "'FILL' 1" : "'FILL' 0" }}>
          {icon}
        </span>
      </div>
      <span className={`font-label-md ${selected ? 'text-primary font-semibold' : 'text-on-surface'}`}>
        {label}
      </span>
    </button>
  );
}