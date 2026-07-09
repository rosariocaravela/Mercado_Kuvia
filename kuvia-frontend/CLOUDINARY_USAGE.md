# 🖼️ Como usar imagens com Cloudinary

## No Frontend

### URLs de imagens vêm diretas do Cloudinary

```jsx
// No componente:
<img 
  src="https://res.cloudinary.com/seu_cloud_name/image/upload/kuvia/products/product-123.webp" 
  alt="Produto"
/>

// Vem da API:
{
  "id": 1,
  "name": "Produto XYZ",
  "images": [
    {
      "id": 1,
      "url": "https://res.cloudinary.com/seu_cloud_name/image/upload/kuvia/products/product-123.webp"
    }
  ]
}
```

## Transformações úteis (opcional)

Cloudinary permite transformações via URL:

```
// Redimensionar
/w_300,h_300,c_fill/

// Crop automático
/c_thumb,g_face/

// Qualidade
/q_auto/

// Formato
/f_webp/
```

Exemplo:
```
https://res.cloudinary.com/seu_cloud_name/image/upload/w_300,h_300,c_fill/kuvia/products/product-123.webp
```

## ✅ Tudo funciona igual

O upload continua exactamente igual:
- `FormData` com `multipart/form-data`
- Campo `images` ou `logo`/`banner`
- Mesma API

**Diferença:** As imagens agora estão seguras e persistem no Render! 🎉
