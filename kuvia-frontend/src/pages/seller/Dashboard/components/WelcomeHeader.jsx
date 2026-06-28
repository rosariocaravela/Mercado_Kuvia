import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';

export default function WelcomeHeader({ storeSlug }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.fullName?.split(' ')[0] || 'Vendedor';

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-ink-black">
          Boas-vindas, {firstName} 👋
        </h2>
        <p className="font-body-md text-ink-gray">Eis o desempenho da sua loja hoje.</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => storeSlug && navigate(`/store/${storeSlug}`)}
          disabled={!storeSlug}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-label-md transition-all ${storeSlug ? 'bg-background-surface border border-border-light text-on-surface-variant hover:bg-surface-container-low' : 'bg-surface-container-low border border-border-light text-on-surface/60 cursor-not-allowed'}`}
        >
          <span className="material-symbols-outlined">visibility</span>
          Ver Minha Loja
        </button>
        <button
          onClick={() => navigate('/seller/products/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-label-md shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Adicionar Produto
        </button>
      </div>
    </div>
  );
}