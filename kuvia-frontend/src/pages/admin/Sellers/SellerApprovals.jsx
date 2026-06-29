import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../../services/adminService';

const statusStyles = {
  PENDING: 'bg-amber-100 text-amber-800',
  APPROVED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-rose-100 text-rose-800'
};

const statusLabels = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado'
};

export default function SellerApprovals() {
  const [sellers, setSellers] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSellers = async () => {
      try {
        setLoading(true);
        const response = await adminService.getSellerApprovals();
        setSellers(response.data || []);
      } catch (err) {
        setError(err.message || 'Não foi possível carregar os vendedores.');
      } finally {
        setLoading(false);
      }
    };

    loadSellers();
  }, []);

  const filteredSellers = useMemo(() => {
    if (filter === 'ALL') return sellers;
    return sellers.filter((seller) => seller.status === filter);
  }, [filter, sellers]);

  const stats = useMemo(() => {
    const pending = sellers.filter((seller) => seller.status === 'PENDING').length;
    const approved = sellers.filter((seller) => seller.status === 'APPROVED').length;
    const rejected = sellers.filter((seller) => seller.status === 'REJECTED').length;

    return { pending, approved, rejected, total: sellers.length };
  }, [sellers]);

  const handleDecision = async (id, status) => {
    try {
      await adminService.updateSellerApproval(id, status);
      setSellers((prev) =>
        prev.map((seller) => (seller.id === id ? { ...seller, status } : seller))
      );
    } catch (err) {
      setError(err.message || 'Não foi possível atualizar a aprovação.');
    }
  };

  return (
    <section className="min-h-screen bg-background px-4 py-8 text-on-background sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-border-light bg-background-surface p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">Administração</p>
            <h1 className="text-3xl font-semibold text-ink-black">Gestão de vendedores</h1>
            <p className="mt-2 text-sm text-ink-gray">
              Revise, aprove ou recuse pedidos de vendedores com controlo e transparência.
            </p>
          </div>

          <Link
            to="/admin"
            className="inline-flex items-center justify-center rounded-full border border-border-light px-4 py-2 text-sm font-medium text-ink-black transition hover:bg-surface-container"
          >
            Voltar ao dashboard
          </Link>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-border-light bg-background-surface p-5">
            <p className="text-sm text-ink-gray">Total</p>
            <p className="mt-2 text-3xl font-semibold text-ink-black">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-border-light bg-background-surface p-5">
            <p className="text-sm text-ink-gray">Pendentes</p>
            <p className="mt-2 text-3xl font-semibold text-amber-600">{stats.pending}</p>
          </div>
          <div className="rounded-2xl border border-border-light bg-background-surface p-5">
            <p className="text-sm text-ink-gray">Aprovados</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-600">{stats.approved}</p>
          </div>
          <div className="rounded-2xl border border-border-light bg-background-surface p-5">
            <p className="text-sm text-ink-gray">Rejeitados</p>
            <p className="mt-2 text-3xl font-semibold text-rose-600">{stats.rejected}</p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === value
                  ? 'bg-primary text-white'
                  : 'border border-border-light bg-background-surface text-ink-gray hover:bg-surface-container'
              }`}
            >
              {value === 'ALL' ? 'Todos' : statusLabels[value]}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-border-light bg-background-surface p-10 text-center text-ink-gray">
            A carregar vendedores...
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSellers.map((seller) => (
              <article key={seller.id} className="rounded-3xl border border-border-light bg-background-surface p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-ink-black">{seller.businessName}</h2>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[seller.status]}`}>
                        {statusLabels[seller.status]}
                      </span>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-ink-gray">Responsável</p>
                        <p className="font-medium text-ink-black">{seller.user?.name || 'Sem nome'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-ink-gray">Categoria</p>
                        <p className="font-medium text-ink-black">{seller.businessType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-ink-gray">Email</p>
                        <p className="font-medium text-ink-black">{seller.user?.email || 'Sem email'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-ink-gray">Telefone</p>
                        <p className="font-medium text-ink-black">{seller.user?.phone || 'Sem telefone'}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-gray">
                      <span>📍 {seller.whatsapp ? 'WhatsApp informado' : 'Sem WhatsApp'}</span>
                      <span>🕒 Enviado em {new Date(seller.createdAt).toLocaleDateString('pt-PT')}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    {seller.status === 'PENDING' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDecision(seller.id, 'APPROVED')}
                          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                        >
                          Aprovar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecision(seller.id, 'REJECTED')}
                          className="rounded-full border border-border-light px-4 py-2 text-sm font-medium text-ink-black transition hover:bg-surface-container"
                        >
                          Rejeitar
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDecision(seller.id, 'PENDING')}
                        className="rounded-full border border-border-light px-4 py-2 text-sm font-medium text-ink-black transition hover:bg-surface-container"
                      >
                        Voltar a pendente
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
