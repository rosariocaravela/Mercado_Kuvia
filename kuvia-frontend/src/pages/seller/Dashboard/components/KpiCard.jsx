export default function KpiCard({ icon, label, value, change, iconColor = 'text-primary', bgColor = 'bg-surface-container-low' }) {
  const isPositive = change?.startsWith('+');
  const changeColor = isPositive ? 'text-secondary bg-secondary-container/20' : 'text-error bg-error-container/20';

  return (
    <div className="bg-background-surface p-6 rounded-xl border border-border-light shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${bgColor} ${iconColor} transition-colors group-hover:bg-primary group-hover:text-white`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {change && (
          <span className={`text-label-sm font-label-sm px-2 py-0.5 rounded ${changeColor}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-body-sm font-body-sm text-ink-gray">{label}</p>
      <p className="text-headline-md font-headline-md text-ink-black mt-1">{value}</p>
    </div>
  );
}