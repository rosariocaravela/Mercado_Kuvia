# 🖼️ Cloudinary Integration - Troubleshooting

## ❌ Erro: "Imagens não carregam - ERR_CONNECTION_REFUSED"

Este é o erro que você viu no console:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
http://localhost:8080/uploads/stores/store-d31b1e0d-875c-4f75-92f8-c9b69731cdeb-1782690283408.jpg
```

## ✅ O que foi mudado (13/07/2024)

### Backend agora usa Cloudinary URLs:
- ✅ `productService.js` - Salva `file.secure_url` (URL Cloudinary) em vez de `/uploads/products/...`
- ✅ `storeService.js` - Salva `file.secure_url` em criar e atualizar lojas
- ✅ Deletar produtos - Apenas apaga BD (Cloudinary gerencia imagens na cloud)

### O que isso significa:
- 🎯 **Novas imagens**: Funcionam perfeitamente (URLs Cloudinary)
- 📌 **Imagens antigas**: Não funcionam (eram caminhos locais `/uploads/...`)

## 🔧 Como corrigir

### Opção 1: Re-enviar imagens (Recomendado)
1. Edite cada loja e re-envie logo/banner
2. Edite cada produto e re-envie as imagens
3. As novas imagens serão salvas como URLs Cloudinary

### Opção 2: Limpar dados e começar do zero (Se tiver poucos dados)
```sql
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM stores;
```
Depois crie novos com upload de imagens

### Opção 3: Script de migração (Para dados em produção)
```javascript
// Backend migration script
const cloudinary = require('cloudinary').v2;

// Fazer upload de imagens antigas para Cloudinary
// E atualizar URLs na BD
```

## 🧪 Como testar

### 1. Verificar Cloudinary está configurado
```bash
# No backend, verfique .env
cat .env | grep CLOUDINARY
```

### 2. Criar nova loja
1. Faça login como vendedor
2. Crie nova loja com upload de logo/banner
3. Abra DevTools (F12) → Console
4. A URL da imagem deve ser Cloudinary: `https://res.cloudinary.com/...`

### 3. Criar novo produto
1. Crie novo produto com upload de imagens
2. Verifique se as imagens aparecem
3. DevTools → Network → verifique se vem de Cloudinary

## 📊 Como verificar no banco de dados

### PostgreSQL
```sql
-- Ver URLs das lojas
SELECT name, logo_url, banner_url FROM stores;

-- Ver URLs dos produtos
SELECT id, url FROM product_images LIMIT 5;
```

Se as URLs começam com `https://res.cloudinary.com/`, está correto! ✅
Se começam com `/uploads/`, são antigas e não funcionarão. ❌

## 🚀 Próximas ações

1. ✅ Configurar Cloudinary (.env com credenciais)
2. ✅ Reiniciar backend: `npm run dev`
3. ✅ Testar criando nova loja/produto
4. 🔄 Re-enviar imagens antigas ou criá-las novas

## 💡 Dicas

- Cloudinary URLs funcionam em HTTPS/HTTP sem problemas
- Imagens são comprimidas automaticamente (WebP)
- Não precisa de servidor local para servir imagens
- URLs Cloudinary são permanentes (não expiram)

## 🆘 Se ainda tiver problemas

1. Verifique se tem credenciais Cloudinary no `.env`
2. Verifique se Backend reiniciou depois das mudanças
3. Tente criar NOVA loja/produto (não editar antigas)
4. Verifique console no DevTools para URLs exatas
5. Teste direto em `https://res.cloudinary.com/seu_cloud_name/` (deve abrir)
