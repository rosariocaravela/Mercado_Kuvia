export default function ActivityFeed({ activities = [] }) {
  // Fallback se não houver atividades
  if (activities.length === 0) {
    return (
      <div className="bg-background-surface p-6 rounded-xl border border-border-light shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline-md text-label-md font-bold text-ink-black">
            Atividade Recente
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">notifications_off</span>
            <p className="font-body-md text-ink-gray">Sem atividades recentes</p>
          </div>
        </div>
      </div>
    );
  }

  // Mapear ícones e cores por tipo de atividade
  const getActivityStyle = (type) => {
    const styles = {
      order: { iconBg: 'bg-secondary-container/20', iconColor: 'text-secondary' },
      review: { iconBg: 'bg-tertiary-fixed/30', iconColor: 'text-tertiary' },
      message: { iconBg: 'bg-primary-container/10', iconColor: 'text-primary' },
      customer: { iconBg: 'bg-surface-container-high', iconColor: 'text-ink-gray' },
    };
    return styles[type] || styles.customer;
  };

  return (
    <div className="bg-background-surface p-6 rounded-xl border border-border-light shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-md text-label-md font-bold text-ink-black">
          Atividade Recente
        </h3>
        <a href="/seller/activity" className="text-label-sm font-label-sm text-primary hover:underline">
          Ver tudo
        </a>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto pr-1 max-h-[400px]">
        {activities.map((activity, index) => {
          const style = getActivityStyle(activity.type);
          
          return (
            <div key={index} className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
                <span
                  className={`material-symbols-outlined ${style.iconColor} text-[20px]`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {activity.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-label-md text-label-md text-ink-black truncate">
                  {activity.title}
                </p>
                <p className="font-body-sm text-body-sm text-ink-gray">
                  {activity.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}