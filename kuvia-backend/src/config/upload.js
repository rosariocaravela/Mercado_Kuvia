const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// ✅ Criar pastas de upload se não existirem
const uploadDirs = {
  stores: 'uploads/stores',
  products: 'uploads/products'
};

Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ✅ Configuração do storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determinar pasta baseada no campo do formulário
    let uploadPath;
    
    if (file.fieldname === 'logo' || file.fieldname === 'banner') {
      uploadPath = uploadDirs.stores;
    } else if (file.fieldname === 'images' || file.fieldname === 'image') {
      uploadPath = uploadDirs.products;
    } else {
      // Fallback para stores se não reconhecido
      uploadPath = uploadDirs.stores;
    }
    
    cb(null, uploadPath);
  },
  
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
    
    if (!allowedExts.includes(ext)) {
      return cb(new Error('Formato não suportado. Use JPG, PNG ou WebP.'), false);
    }
    
    // Prefixo baseado no tipo de upload
    const prefix = (file.fieldname === 'logo' || file.fieldname === 'banner') 
      ? 'store' 
      : 'product';
    
    const uniqueName = `${prefix}-${uuidv4()}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

// ✅ Filtro de arquivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagem não suportado. Use JPG, PNG ou WebP.'), false);
  }
};

// ✅ Configuração final do multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo por imagem
    files: 10 // Aumentado para suportar múltiplos uploads
  }
});

module.exports = upload;