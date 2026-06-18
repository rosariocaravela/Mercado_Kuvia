import { useState, useEffect } from 'react';
import { dashboardService } from '../../../../services/dashboardService';

export default function SalesChart({ salesData: initialSalesData }) {
  const [period, setPeriod] = useState('7days');
  const [salesData, setSalesData] = useState(initialSalesData);
  const [loading, setLoading] = useState(false);

  // Carregar dados quando o período mudar
  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const days = period === '7days' ? 7 : 30;
        const response = await dashboardService.getSalesTrend(days);
        if (response.success) {
          setSalesData(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados de vendas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [period]);

  const data = salesData || { labels: [], values: [] };
  const maxValue = Math.max(...data.values, 1);

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
          disabled={loading}
          className="text-label-sm font-label-sm border-border-light rounded-lg focus:ring-primary focus:border-primary disabled:opacity-50"
        >
          <option value="7days">Últimos 7 dias</option>
          <option value="30days">Últimos 30 dias</option>
        </select>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : data.values.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-ink-gray">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">trending_down</span>
            <p className="font-body-md">Sem dados de vendas neste período</p>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}