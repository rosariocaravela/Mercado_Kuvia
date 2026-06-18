const activities = [
  {
    icon: 'shopping_cart',
    iconBg: 'bg-secondary-container/20',
    iconColor: 'text-secondary',
    title: 'Novo pedido: #1284',
    subtitle: 'Mariana Silva • 12:45',
  },
  {
    icon: 'chat',
    iconBg: 'bg-primary-container/10',
    iconColor: 'text-primary',
    title: 'Pergunta via WhatsApp',
    subtitle: 'Carlos Alberto • 11:30',
  },
  {
    icon: 'star',
    iconBg: 'bg-tertiary-fixed/30',
    iconColor: 'text-tertiary',
    title: 'Nova avaliação (5 ⭐)',
    subtitle: 'Ana Paula • Ontem',
  },
  {
    icon: 'person_add',
    iconBg: 'bg-surface-container-high',
    iconColor: 'text-ink-gray',
    title: 'Novo cliente registado',
    subtitle: 'Joaquim L. • Ontem',
  },
];

export default function ActivityFeed() {
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

      <div className="flex-1 space-y-5 overflow-y-auto pr-1">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full ${activity.iconBg} flex items-center justify-center flex-shrink-0`}>
              <span
                className={`material-symbols-outlined ${activity.iconColor} text-[20px]`}
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
        ))}
      </div>
    </div>
  );
}