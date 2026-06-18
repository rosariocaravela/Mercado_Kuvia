import { generateWhatsAppLink } from '../../utils/whatsappLink';

export default function WhatsAppButton({ phone, storeName, productName, productUrl, className = "" }) {
  const link = generateWhatsAppLink({ phone, storeName, productName, productUrl });
  
  return (
    <a href={link} target="_blank" rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-lg flex items-center gap-2 font-label-md transition-all hover:scale-105 active:scale-95 ${className}`}
      aria-label="Contactar via WhatsApp">
      <span className="material-symbols-outlined">chat</span>
      <span className="hidden md:inline">Pedir via WhatsApp</span>
    </a>
  );
}