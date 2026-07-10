const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Integração com Cloudinary (serviço externo)
// - Credenciais via variáveis de ambiente em `src/config/cloudinary.js`.
// - Converter para `webp` reduz largura de banda/armazenamento; confirme compatibilidade.
// Configuração do Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determinar pasta baseada no fieldname
    let folder;
    
    if (file.fieldname === 'logo' || file.fieldname === 'banner') {
      folder = 'kuvia/stores';
    } else if (file.fieldname === 'images' || file.fieldname === 'image') {
      folder = 'kuvia/products';
    } else {
      folder = 'kuvia/uploads';
    }
    
    return {
      folder: folder,
      resource_type: 'auto',
      public_id: `${file.fieldname}-${Date.now()}`,
      format: 'webp' // Converter para WebP para melhor compressão
    };
  }
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagem não suportado. Use JPG, PNG ou WebP.'), false);
  }
};

// Configuração final do multer com Cloudinary
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB máximo por imagem (Cloudinary pode receber)
    files: 10 // Múltiplos uploads
  }
});

module.exports = upload;
