const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Garantir pasta de uploads para lojas
const uploadDir = 'uploads/stores';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do storage para imagens de lojas
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // Nome único: store-{uuid}-{timestamp}.{ext}
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
    
    if (!allowedExts.includes(ext)) {
      return cb(new Error('Formato não suportado. Use JPG, PNG ou WebP.'), false);
    }
    
    const uniqueName = `store-${uuidv4()}-${Date.now()}${ext}`;
    cb(null, uniqueName);
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

// Configuração final do multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo por imagem
    files: 2 // Máximo 2 uploads por requisição (logo + banner)
  }
});

module.exports = upload;