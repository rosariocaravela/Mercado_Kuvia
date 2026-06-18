import { useEffect, useState } from 'react';
import WelcomeHeader from './components/WelcomeHeader';
import KpiCard from './components/KpiCard';
import SalesChart from './components/SalesChart';
import ActivityFeed from './components/ActivityFeed';
import MarketingPromo from './components/MarketingPromo';

const kpis = [
  {
    icon: 'inventory_2',
    label: 'Total de Produtos',
    value: '124',
    change: '+4%',
  },
  {
    icon: 'visibility',
    label: 'Visualizações',
    value: '8.432',
    change: '+12%',
  },
  {
    icon: 'chat',
    label: 'Pedidos WhatsApp',
    value: '56',
    change: '+18%',
  },
  {
    icon: 'payments',
    label: 'Receita Estimada',
    value: 'MT 45.200',
    change: '+2%',
  },
];

export default function SellerDashboard() {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Buscar dados reais da API
    // fetchStoreData().then(data => setStoreData(data));
    
    // Dados mockados para demonstração
    setStoreData({
      name: 'Minha Loja',
      slug: 'minha-loja',
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="px-margin-page py-8 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-margin-page py-8 max-w-container-max mx-auto w-full space-y-8">
      {/* Saudação */}
      <WelcomeHeader storeSlug={storeData?.slug} />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
        {kpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {/* Gráfico + Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-desktop">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>

      {/* Promoção de Marketing */}
      <MarketingPromo />
    </div>
  );
}