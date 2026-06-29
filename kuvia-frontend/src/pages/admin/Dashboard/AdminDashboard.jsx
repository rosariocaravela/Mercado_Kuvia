import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const quickStats = [
  { label: 'Vendedores pendentes', value: '12', detail: 'Aguardam aprovação', accent: 'text-amber-600' },
  { label: 'Lojas ativas', value: '84', detail: 'Publicadas e ativas', accent: 'text-emerald-600' },
  { label: 'Pedidos hoje', value: '38', detail: 'Últimas 24 horas', accent: 'text-primary' },
  { label: 'Utilizadores', value: '320', detail: 'Clientes + vendedores', accent: 'text-sky-600' }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <section className="min-h-screen bg-background px-4 py-8 text-on-background sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-border-light bg-background-surface p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">Painel administrativo</p>
            <h1 className="text-3xl font-semibold text-ink-black">Bem-vindo ao dashboard do admin</h1>
            <p className="mt-2 text-sm text-ink-gray">
              Acompanhe o estado da plataforma, valide vendedores e mantenha a operação em ordem.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/sellers"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Ver vendedores
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-border-light px-4 py-2 text-sm font-medium text-ink-black transition hover:bg-surface-container"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickStats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-border-light bg-background-surface p-5 shadow-sm">
              <p className="text-sm text-ink-gray">{item.label}</p>
              <p className={`mt-3 text-3xl font-semibold ${item.accent}`}>{item.value}</p>
              <p className="mt-2 text-sm text-ink-gray">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-border-light bg-background-surface p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-ink-black">Atividade recente</h2>
              <span className="text-sm text-ink-gray">Hoje</span>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Novo pedido de vendedor', detail: 'Ana Moda submeteu os dados para aprovação.', time: '09:30' },
                { title: 'Loja publicada', detail: 'Tech Hub foi ativada e já aparece no catálogo.', time: '08:15' },
                { title: 'Pagamento recebido', detail: 'Recebido pagamento de mensalidade para uma loja premium.', time: 'Ontem' }
              ].map((activity) => (
                <div key={activity.title} className="rounded-2xl bg-surface-container-low p-4">
                  <p className="font-medium text-ink-black">{activity.title}</p>
                  <p className="mt-1 text-sm text-ink-gray">{activity.detail}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-primary">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border-light bg-background-surface p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-ink-black">Ações rápidas</h2>
            <div className="mt-4 space-y-3">
              <Link to="/admin/sellers" className="block rounded-2xl border border-border-light p-4 transition hover:bg-surface-container">
                <p className="font-medium text-ink-black">Aprovar vendedores</p>
                <p className="mt-1 text-sm text-ink-gray">Revise pedidos pendentes e valide lojas.</p>
              </Link>
              <Link to="/admin/stores" className="block rounded-2xl border border-border-light p-4 transition hover:bg-surface-container">
                <p className="font-medium text-ink-black">Gerir lojas</p>
                <p className="mt-1 text-sm text-ink-gray">Verificar lojas publicadas e conteúdo.</p>
              </Link>
              <Link to="/admin/users" className="block rounded-2xl border border-border-light p-4 transition hover:bg-surface-container">
                <p className="font-medium text-ink-black">Gerir utilizadores</p>
                <p className="mt-1 text-sm text-ink-gray">Administrar clientes e contas de acesso.</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
