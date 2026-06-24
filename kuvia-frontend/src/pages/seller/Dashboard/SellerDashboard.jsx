import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { dashboardService } from '../../../services/dashboardService';
import WelcomeHeader from './components/WelcomeHeader';
import KpiCard from './components/KpiCard';
import SalesChart from './components/SalesChart';
import ActivityFeed from './components/ActivityFeed';
import MarketingPromo from './components/MarketingPromo';

export default function SellerDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await dashboardService.getDashboardData();
        
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError(response.message || 'Erro ao carregar dados');
        }
      } catch (err) {
        console.error('❌ Erro ao carregar dashboard:', err);
        
        if (err.response?.status === 404) {
          setError('Loja não encontrada. Crie uma loja primeiro.');
        } else if (err.response?.status === 401) {
          setError('Sessão expirada. Faça login novamente.');
        } else {
          setError('Erro ao carregar dados do dashboard. Tente novamente.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Estado de carregamento
  if (loading) {
    return (
      <div className="px-margin-page py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body-md text-ink-gray">A carregar dados do dashboard...</p>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="px-margin-page py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-error">error</span>
          </div>
          <h2 className="font-headline-md text-ink-black mb-2">Ops! Algo correu mal</h2>
          <p className="font-body-md text-ink-gray mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-primary text-white rounded-lg font-label-md hover:opacity-90 transition-all"
            >
              Tentar Novamente
            </button>
            <button
              onClick={() => navigate('/seller/criar-loja')}
              className="px-6 py-2.5 bg-background-surface border border-border-light rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-low transition-all"
            >
              Criar Loja
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se não houver dados
  if (!dashboardData) {
    return null;
  }

  const { store, stats, salesData, activities, recentProducts } = dashboardData;

  // Dados para KPIs (com fallback para dados mockados se a API não retornar)
  const kpis = [
    {
      icon: 'inventory_2',
      label: 'Total de Produtos',
      value: stats?.totalProducts?.toString() || '0',
      change: '+4%',
    },
    {
      icon: 'visibility',
      label: 'Visualizações',
      value: stats?.totalViews?.toLocaleString('pt-MZ') || '0',
      change: stats?.viewsChange || '+12%',
    },
    {
      icon: 'chat',
      label: 'Pedidos WhatsApp',
      value: stats?.totalOrders?.toString() || '0',
      change: '+18%',
    },
    {
      icon: 'payments',
      label: 'Receita Estimada',
      value: `MT ${(stats?.revenue || 0).toLocaleString('pt-MZ')}`,
      change: '+2%',
    },
  ];

  return (
    <div className="px-margin-page py-8 max-w-container-max mx-auto w-full space-y-8">
      {/* Saudação */}
      <WelcomeHeader storeSlug={store?.slug} />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
        {kpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {/* Gráfico + Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-desktop">
        <div className="lg:col-span-2">
          <SalesChart salesData={salesData} hasStore={Boolean(store)} />
        </div>
        <div>
          <ActivityFeed activities={activities} />
        </div>
      </div>

      {/* Promoção de Marketing */}
      <MarketingPromo />
    </div>
  );
}