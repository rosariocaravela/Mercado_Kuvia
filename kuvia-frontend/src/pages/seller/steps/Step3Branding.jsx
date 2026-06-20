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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', storeData.name);
      formData.append('slug', storeData.slug);
      formData.append('categories', JSON.stringify(storeData.categories));
      formData.append('whatsapp_number', storeData.whatsapp);
      formData.append('description', storeData.description || '');
      formData.append('theme_config', JSON.stringify(storeData.theme));
      if (storeData.logo) formData.append('logo', storeData.logo);
      if (storeData.banner) formData.append('banner', storeData.banner);

      const response = await storeService.createStore(formData);
      setPublished(true);
      setTimeout(() => onComplete(response.data.store), 2000);
    } catch (error) {
      console.error('Erro ao publicar:', error);
      const backendMessage = error.response?.data?.message ||
        (error.response?.data?.errors ? error.response.data.errors.map(e => e.message).join(', ') : null) ||
        error.message ||
        'Não foi possível publicar. Tente novamente.';
      alert(backendMessage);
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
        <p className="font-body-md text-on-surface-variant mb-6">A sua loja <strong>{storeData.name}</strong> já está online.</p>
        <div className="bg-background-subtle border border-border-light rounded-lg p-4 inline-block mb-8">
          <p className="font-label-sm text-on-surface-variant">Acesse agora:</p>
          <a href={`/store/${storeData.slug}`} className="font-body-md font-semibold text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            kuvia.co.mz/{storeData.slug}
          </a>
        </div>
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <WizardProgress currentStep={3} />
      
      <div className="bg-background-surface rounded-xl border border-border-light shadow-lg p-8 md:p-10">
        <div className="mb-8">
          <h1 className="font-headline-lg text-ink-black mb-2">Personalize sua marca</h1>
          <p className="font-body-md text-on-surface-variant">A identidade visual gera confiança nos clientes.</p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload label="Logotipo da Loja" hint="PNG ou JPG, máx. 5MB"
              onImageSelect={(file, preview) => { updateStoreData('logo', file); setLogoPreview(preview); }} previewUrl={logoPreview} />
            <ImageUpload label="Banner da Loja" hint="1200 x 400 px recomendado"
              onImageSelect={(file, preview) => { updateStoreData('banner', file); setBannerPreview(preview); }} previewUrl={bannerPreview} />
          </div>

          <StorePreview storeName={storeData.name} logoUrl={logoPreview} bannerUrl={bannerPreview} categories={storeData.categories} />

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button type="button" onClick={onBack} disabled={isSubmitting} className="flex-1 order-2 sm:order-1 bg-white border border-border-light text-ink-black py-3 rounded-lg font-label-md hover:bg-background-subtle transition-all active:scale-95 disabled:opacity-50">Voltar</button>
            <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex-[2] order-1 sm:order-2 bg-primary text-on-primary py-3 rounded-lg font-label-md shadow-md hover:shadow-lg hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70">
              {isSubmitting ? <><span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" /> Processando...</> : <><>Concluir e Publicar Loja</><span className="material-symbols-outlined">rocket_launch</span></>}
            </button>
          </div>
        </div>

        <p className="mt-8 text-center font-body-sm text-on-surface-variant max-w-md mx-auto">
          Ao clicar em publicar, você concorda com os nossos <a href="/termos" className="text-primary hover:underline">Termos de Serviço</a> e <a href="/privacidade" className="text-primary hover:underline">Políticas de Privacidade</a>.
        </p>
      </div>
    </div>
  );
}