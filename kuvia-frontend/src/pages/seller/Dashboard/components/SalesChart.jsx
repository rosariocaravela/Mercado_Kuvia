import { useState } from 'react';

const mockData = {
  '7days': {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    values: [2400, 3800, 5200, 3500, 4100, 6400, 2900],
  },
  '30days': {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    values: [18500, 24300, 31200, 28700],
  },
};

export default function SalesChart() {
  const [period, setPeriod] = useState('7days');
  const data = mockData[period];
  const maxValue = Math.max(...data.values);

  const formatValue = (val) => {
    if (val >= 1000) return `MT ${(val / 1000).toFixed(1)}k`;
    return `MT ${val}`;
  };

  return (
    <div className="bg-background-surface p-6 rounded-xl border border-border-light shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-headline-md text-label-md font-bold text-ink-black">
          Tendência de Vendas
        </h3>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="text-label-sm font-label-sm border-border-light rounded-lg focus:ring-primary focus:border-primary"
        >
          <option value="7days">Últimos 7 dias</option>
          <option value="30days">Últimos 30 dias</option>
        </select>
      </div>

      {/* Gráfico de Barras */}
      <div className="relative h-[300px] w-full flex items-end justify-between gap-2 px-2">
        {data.values.map((value, index) => {
          const heightPercent = (value / maxValue) * 100;
          const isMax = value === maxValue;

          return (
            <div
              key={index}
              className={`flex-1 rounded-t-lg transition-all group relative ${
                isMax ? 'bg-primary-container' : 'bg-surface-container-low hover:bg-primary-container'
              }`}
              style={{ height: `${heightPercent}%` }}
            >
              {/* Tooltip */}
              <div
                className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-ink-black text-white px-2 py-1 rounded text-[10px] transition-opacity ${
                  isMax ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                {formatValue(value)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-4 text-label-sm font-label-sm text-ink-gray px-2">
        {data.labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
    </div>
  );
}