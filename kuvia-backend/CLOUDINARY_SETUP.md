# 🎉 Cloudinary Setup Guide

## ✅ O que foi instalado

- ✅ `cloudinary` - Biblioteca Cloudinary
- ✅ `multer-storage-cloudinary` - Storage adapter para multer

## ✅ Ficheiros criados/modificados

1. **`src/config/cloudinary.js`** - Configuração do Cloudinary
2. **`src/config/uploadCloudinary.js`** - Configuração do multer com Cloudinary
3. **`.env.example`** - Template com as variáveis necessárias
4. **`src/app.js`** - Removido o serve estático local
5. **`src/routes/productRoutes.js`** - Atualizado para usar Cloudinary
6. **`src/routes/storeRoutes.js`** - Atualizado para usar Cloudinary

## 🔐 Configurar Cloudinary

### Passo 1: Criar conta no Cloudinary
1. Aceda a https://cloudinary.com
2. Registe-se (é gratuito!)
3. Após confirmar email, vai para o dashboard

### Passo 2: Obter as credenciais
No dashboard do Cloudinary:
1. Vá para **Settings** (⚙️)
2. Clique em **API Keys**
3. Copie:
   - **Cloud Name** (já visível no topo)
   - **API Key**
   - **API Secret** (não partilhe!)

### Passo 3: Atualizar `.env`
```env
CLOUDINARY_CLOUD_NAME=seu_cloud_name_aqui
CLOUDINARY_API_KEY=sua_api_key_aqui
CLOUDINARY_API_SECRET=seu_api_secret_aqui
```

## 📝 Como funciona agora

### Upload de Imagens
- Quando o frontend faz upload, as imagens vão **diretamente para Cloudinary**
- A resposta inclui a URL segura: `secure_url`
- As imagens estão disponíveis globalmente (CDN)

### URLs de Imagens
```
https://res.cloudinary.com/seu_cloud_name/image/upload/kuvia/products/product-123.webp
```

### Transformações automáticas
- Formato: **WebP** (melhor compressão)
- Pasta: **kuvia/stores** ou **kuvia/products**
- Tamanho máximo: **10MB** por imagem

## 🚀 Testar

### Teste local
```bash
npm run dev
```

### Teste a criar uma loja
1. Faça login como vendedor
2. Crie/edite uma loja
3. Faça upload da logo/banner
4. As imagens devem aparecer no Cloudinary Dashboard

### Verificar uploads no Cloudinary
1. Vá ao dashboard do Cloudinary
2. Clique em **Media Library**
3. Veja todas as imagens na pasta **kuvia/**

## ✨ Bénefícios

✅ Armazenamento ilimitado (plano gratuito generoso)
✅ CDN global para rápido carregamento
✅ Compressão automática (WebP)
✅ Sem problemas em produção (Render)
✅ URLs permanentes e seguras
✅ Backups automáticos

## 🐛 Troubleshooting

### "Error: cloudinary credentials not configured"
- Verifique as variáveis no `.env`
- As credenciais estão correctas?
- Reinicie o servidor: `npm run dev`

### "Cannot upload - 401 Unauthorized"
- API Secret pode estar errado
- Gere novas chaves no Cloudinary

### "File upload timeout"
- O ficheiro pode ser muito grande (>10MB)
- O servidor Cloudinary pode estar lento (temporário)

## 📚 Mais informações

- Documentação: https://cloudinary.com/documentation
- Multer Cloudinary: https://github.com/afzaliwala/multer-storage-cloudinary
