import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeService } from '../../services/storeService';

export default function SellerStoreRedirect() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [store, setStore] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyStore = async () => {
      try {
        const response = await storeService.getMyStore();

        if (!response?.success) {
          setStatus('failed');
          setError(response?.message || 'Não foi possível carregar a sua loja.');
          return;
        }

        if (!response.data) {
          setStatus('no-store');
          return;
        }

        setStore(response.data);

        if (response.data.slug) {
          if (response.data.is_active && response.data.status === 'APPROVED') {
            navigate(`/store/${response.data.slug}`, { replace: true });
            return;
          }

          setStatus('pending');
          return;
        }

        setStatus('no-store');
      } catch (err) {
        console.error('Erro ao carregar loja do vendedor:', err);
        setStatus('failed');
        setError(err.response?.data?.message || err.message || 'Erro desconhecido.');
      }
    };

    fetchMyStore();
  }, [navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-subtle px-margin-page">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-body-md text-ink-gray">A carregar a sua loja...</p>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-subtle px-margin-page py-16">
        <div className="max-w-xl w-full bg-background-surface border border-border-light rounded-3xl p-10 text-center shadow-sm">
          <div className="mb-6">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary text-3xl">
              <span className="material-symbols-outlined">hourglass_top</span>
            </span>
          </div>
          <h1 className="font-headline-lg text-ink-black mb-4">A sua loja está em análise</h1>
          <p className="font-body-md text-ink-gray mb-6">
            A loja <strong>{store?.name}</strong> foi criada com sucesso e está aguardando aprovação.
            Assim que for aprovada, ficará disponível publicamente em <strong>/store/{store?.slug}</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => navigate('/seller/dashboard')}
              className="px-6 py-3 bg-primary text-white rounded-full font-label-md hover:opacity-90 transition-all"
            >
              Voltar ao dashboard
            </button>
            <button
              type="button"
              onClick={() => navigate('/seller/criar-loja')}
              className="px-6 py-3 border border-border-light rounded-full font-label-md hover:bg-surface-container-low transition-all"
            >
              Editar Loja
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'no-store') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-subtle px-margin-page py-16">
        <div className="max-w-xl w-full bg-background-surface border border-border-light rounded-3xl p-10 text-center shadow-sm">
          <div className="mb-6">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-fixed/10 text-secondary-fixed text-3xl">
              <span className="material-symbols-outlined">storefront</span>
            </span>
          </div>
          <h1 className="font-headline-lg text-ink-black mb-4">Nenhuma loja encontrada</h1>
          <p className="font-body-md text-ink-gray mb-6">
            Ainda não tem uma loja criada. Comece agora o processo para publicar a sua loja.
          </p>
          <button
            type="button"
            onClick={() => navigate('/seller/criar-loja')}
            className="px-6 py-3 bg-primary text-white rounded-full font-label-md hover:opacity-90 transition-all"
          >
            Criar loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-subtle px-margin-page py-16">
      <div className="max-w-xl w-full bg-background-surface border border-border-light rounded-3xl p-10 text-center shadow-sm">
        <div className="mb-6">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-container/10 text-error text-3xl">
            <span className="material-symbols-outlined">error</span>
          </span>
        </div>
        <h1 className="font-headline-lg text-ink-black mb-4">Não foi possível abrir a sua loja</h1>
        <p className="font-body-md text-ink-gray mb-6">{error || 'Ocorreu um erro ao carregar a sua loja.'}</p>
        <button
          type="button"
          onClick={() => navigate('/seller/dashboard')}
          className="px-6 py-3 bg-primary text-white rounded-full font-label-md hover:opacity-90 transition-all"
        >
          Voltar ao dashboard
        </button>
      </div>
    </div>
  );
}
