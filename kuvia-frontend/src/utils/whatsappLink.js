/**
 * Gera link WhatsApp com mensagem pré-preenchida (formato Moçambique)
 */
export const generateWhatsAppLink = ({ phone, storeName, productName, productUrl }) => {
    // Formatar número para padrão internacional
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('258') 
      ? cleanPhone 
      : cleanPhone.startsWith('8') 
        ? `258${cleanPhone}` 
        : `258${cleanPhone}`;
    
    // Mensagem personalizada
    const message = productName
      ? `Olá! Vi o produto "${productName}" na sua loja ${storeName} na Kuvia. Gostava de mais informações. ${productUrl ? `\nLink: ${productUrl}` : ''}`
      : `Olá! Visitei a sua loja ${storeName} na Kuvia e gostaria de fazer um pedido.`;
    
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  };