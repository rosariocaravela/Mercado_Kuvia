import { generateWhatsAppLink } from '../../utils/whatsappLink';

/**
 * Botão flutuante do WhatsApp
 * 
 * @param {string} phone - Número do vendedor (ex: "+258842567470")
 * @param {string} storeName - Nome da loja
 * @param {string} productName - (Opcional) Nome do produto específico
 * @param {string} className - Classes CSS adicionais
 */
export default function WhatsAppButton({ 
  phone, 
  storeName, 
  productName = null,
  productUrl = null,
  className = "" 
}) {
  if (!phone) return null;

  const link = generateWhatsAppLink({ phone, storeName, productName, productUrl });

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-20 md:bottom-8 right-6 z-50 group flex items-center gap-3 ${className}`}
      aria-label="Falar com vendedor via WhatsApp"
    >
      {/* Tooltip - aparece no hover (desktop) */}
      <span className="bg-white text-ink-black font-label-md text-label-md px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 hidden md:inline-block">
        Falar com Vendedor
      </span>
      
      {/* Ícone do WhatsApp */}
      <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_8px_30px_rgb(16,185,129,0.3)] hover:scale-110 active:scale-95 transition-all">
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.538-2.961-2.654-.087-.116-.708-.94-.708-1.793 0-.853.434-1.274.587-1.448.154-.174.335-.217.447-.217.112 0 .224.001.321.005.102.004.238-.039.373.287.136.326.467 1.141.508 1.228.041.087.069.188.01.304-.058.116-.087.188-.174.289-.087.101-.182.226-.26.304-.089.086-.181.181-.078.358.103.177.459.758.984 1.226.676.602 1.246.788 1.42.875.174.087.275.072.376-.044.101-.116.434-.506.55-.68.116-.174.232-.145.39-.087.158.058 1.001.472 1.174.558.173.087.289.13.333.202.044.072.044.419-.1.824z" />
        </svg>
      </div>
    </a>
  );
}