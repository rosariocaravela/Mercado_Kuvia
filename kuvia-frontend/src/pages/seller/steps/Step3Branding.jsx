import { useState } from 'react';
import { useStoreCreation } from '../../../context/StoreCreationContext';
import { storeService } from '../../../services/storeService';
import WizardProgress from '../components/wizard/WizardProgress';
import ImageUpload from '../components/wizard/ImageUpload';
import StorePreview from '../components/wizard/StorePreview';

export default function Step3Branding({ onComplete, onBack }) {
  const { storeData, updateStoreData, setIsSubmitting, isSubmitting } = useStoreCreation();
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      // ✅ Formatar WhatsApp para padrão internacional (+258XXXXXXXXX)
      const whatsappClean = storeData.whatsapp.replace(/\D/g, ''); // Remove tudo que não é número
      let whatsappFormatted;

      if (whatsappClean.startsWith('258')) {
        whatsappFormatted = `+${whatsappClean}`;  // ← ADICIONA +
      } else if (whatsappClean.startsWith('8')) {
        whatsappFormatted = `+258${whatsappClean}`; // ← ADICIONA +258
      } else {
        whatsappFormatted = `+${whatsappClean}`;
      }

      const formData = new FormData();
      formData.append('name', storeData.name);
      formData.append('slug', storeData.slug);
      formData.append('whatsapp_number', whatsappFormatted); // ✅ WhatsApp formatado
      formData.append('description', storeData.description || '');
      formData.append('theme_config', JSON.stringify(storeData.theme || { primaryColor: '#0050cb' }));

      if (storeData.logo) formData.append('logo', storeData.logo);
      if (storeData.banner) formData.append('banner', storeData.banner);

      console.log('📤 Enviando dados da loja...');
      console.log('Nome:', storeData.name);
      console.log('Slug:', storeData.slug);
      console.log('WhatsApp:', whatsappFormatted);
      console.log('Logo:', storeData.logo?.name || 'Nenhum');
      console.log('Banner:', storeData.banner?.name || 'Nenhum');

      const response = await storeService.createStore(formData);

      console.log('✅ Loja criada com sucesso:', response);

      setPublished(true);
      setTimeout(() => onComplete(response.data?.data || response.data), 2000);

    } catch (err) {
      console.error('❌ Erro ao publicar loja:', err);

      const errorMessage = err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Não foi possível publicar a loja. Tente novamente.';

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (published) {
    return (
      <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-secondary-fixed rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl text-on-secondary-fixed">check_circle</span>
        </div>
        <h2 className="font-headline-lg text-ink-black mb-3">Loja publicada com sucesso! 🎉</h2>
        <p className="font-body-md text-on-surface-variant mb-6">
          A sua loja <strong>{storeData.name}</strong> já está online.
        </p>
        <div className="bg-background-subtle border border-border-light rounded-lg p-4 inline-block mb-8">
          <p className="font-label-sm text-on-surface-variant">Acesse agora:</p>
          <a
            href={`/store/${storeData.slug}`}
            className="font-body-md font-semibold text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            kuvia.co.mz/{storeData.slug}
          </a>
        </div>
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <WizardProgress currentStep={2} totalSteps={2} />

      <div className="bg-background-surface rounded-xl border border-border-light shadow-lg p-8 md:p-10">
        <div className="mb-8">
          <h1 className="font-headline-lg text-ink-black mb-2">Personalize sua marca</h1>
          <p className="font-body-md text-on-surface-variant">
            A identidade visual da sua loja gera confiança nos clientes.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-lg text-error font-body-sm flex items-start gap-2">
            <span className="material-symbols-outlined text-sm mt-0.5">error</span>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-8">
          {/* Uploads em Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              label="Logotipo da Loja"
              hint="PNG ou JPG, máx. 5MB"
              onImageSelect={(file, preview) => { updateStoreData('logo', file); setLogoPreview(preview); }}
              previewUrl={logoPreview}
            />
            <ImageUpload
              label="Banner da Loja"
              hint="1200 x 400 px recomendado"
              onImageSelect={(file, preview) => { updateStoreData('banner', file); setBannerPreview(preview); }}
              previewUrl={bannerPreview}
            />
          </div>

          {/* Preview Ao Vivo */}
          <StorePreview
            storeName={storeData.name}
            logoUrl={logoPreview}
            bannerUrl={bannerPreview}
          />

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="flex-1 order-2 sm:order-1 bg-white border border-border-light text-ink-black py-3 rounded-lg font-label-md hover:bg-background-subtle transition-all active:scale-95 disabled:opacity-50"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-[2] order-1 sm:order-2 bg-primary text-on-primary py-3 rounded-lg font-label-md shadow-md hover:shadow-lg hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  Concluir e Publicar Loja
                  <span className="material-symbols-outlined">rocket_launch</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Termos */}
        <p className="mt-8 text-center font-body-sm text-on-surface-variant max-w-md mx-auto">
          Ao clicar em publicar, você concorda com os nossos{' '}
          <a href="/termos" className="text-primary hover:underline">Termos de Serviço</a> e{' '}
          <a href="/privacidade" className="text-primary hover:underline">Políticas de Privacidade</a>.
        </p>
      </div>
    </div>
  );
}