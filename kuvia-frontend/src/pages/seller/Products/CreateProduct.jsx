import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../../services/productService';
import { categoryService } from '../../../services/categoryService';
import { formatCurrency } from '../../../utils/formatters';

const CONDITIONS = [
  { value: 'NOVO', label: 'Novo' },
  { value: 'USADO_BOM', label: 'Usado (Bom estado)' },
  { value: 'USADO_REGULAR', label: 'Usado (Estado regular)' }
];

export default function CreateProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'MZN',
    stock: '',
    condition: 'NOVO',
    categoryId: '',
    images: [],
    isActive: true
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  // Carregar categorias
  useEffect(() => {
    loadCategories();
  }, []);

  // Carregar produto se estiver a editar
  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productService.getProductById(id);
      if (response.success) {
        const p = response.data;
        setFormData({
          name: p.name || '',
          description: p.description || '',
          price: p.price?.toString() || '',
          currency: p.currency || 'MZN',
          stock: p.stock?.toString() || '',
          condition: p.condition || 'NOVO',
          categoryId: p.categoryId || '',
          images: p.images || [],
          isActive: p.isActive !== false
        });
        setImagePreviews(p.images?.map(img => img.url || img.imageUrl) || []);
      }
    } catch (err) {
      console.error('Erro ao carregar produto:', err);
      setError('Erro ao carregar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('description', formData.description);
      formDataObj.append('price', formData.price);
      formDataObj.append('currency', formData.currency);
      formDataObj.append('stock', formData.stock);
      formDataObj.append('condition', formData.condition);
      if (formData.categoryId) {
        formDataObj.append('categoryId', formData.categoryId);
      }
      formDataObj.append('isActive', formData.isActive);

      formData.images.forEach((image) => {
        if (image instanceof File) {
          formDataObj.append('images', image);
        }
      });

      if (isEditing) {
        await productService.updateProduct(id, formDataObj);
      } else {
        await productService.createProduct(formDataObj);
      }

      navigate('/seller/products');
    } catch (err) {
      console.error('Erro ao guardar produto:', err);
      setError(err.response?.data?.message || 'Erro ao guardar produto');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="px-margin-page py-8 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-margin-page py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/seller/products')}
          className="p-2 hover:bg-surface-container rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="font-headline-lg text-headline-lg text-ink-black">
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </h1>
          <p className="font-body-md text-on-surface-variant">
            {isEditing ? 'Actualiza as informações do produto' : 'Adiciona um novo produto à tua loja'}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-container border border-error/30 rounded-lg text-error font-body-sm flex items-start gap-2">
          <span className="material-symbols-outlined text-sm mt-0.5">error</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-background-surface border border-border-light rounded-xl p-6">
          <h2 className="font-headline-md text-ink-black mb-4">Informações Básicas</h2>
          
          <div className="space-y-4">
            <div>
              <label className="font-label-md text-on-surface block mb-2">
                Nome do Produto *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Smartphone Samsung Galaxy S24"
                className="w-full px-4 py-3 rounded-lg border border-border-light focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="font-label-md text-on-surface block mb-2">
                Descrição
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreve o teu produto em detalhe..."
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-border-light focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-label-md text-on-surface block mb-2">
                  Preço (MT) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-lg border border-border-light focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                  required
                />
                {formData.price && (
                  <p className="text-body-sm text-primary mt-1 font-semibold">
                    {formatCurrency(formData.price)}
                  </p>
                )}
              </div>

              <div>
                <label className="font-label-md text-on-surface block mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-3 rounded-lg border border-border-light focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-label-md text-on-surface block mb-2">
                  Categoria
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border-light focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all bg-background-surface"
                >
                  <option value="">Selecciona uma categoria</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-body-sm text-on-surface-variant mt-2">
                    Nenhuma categoria encontrada. Crie o produto sem categoria ou atualize suas categorias no admin.
                  </p>
                )}
              </div>

              <div>
                <label className="font-label-md text-on-surface block mb-2">
                  Condição *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border-light focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all bg-background-surface"
                  required
                >
                  {CONDITIONS.map(cond => (
                    <option key={cond.value} value={cond.value}>
                      {cond.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background-surface border border-border-light rounded-xl p-6">
          <h2 className="font-headline-md text-ink-black mb-4">Imagens do Produto</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border-light">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-error text-on-error rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 bg-primary text-on-primary text-[10px] px-2 py-1 rounded-full">
                    Principal
                  </span>
                )}
              </div>
            ))}

            {imagePreviews.length < 5 && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-outline-variant flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <span className="material-symbols-outlined text-3xl text-primary mb-2">add_photo_alternate</span>
                <span className="font-label-sm text-label-sm text-primary">Adicionar</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  {5 - imagePreviews.length} restantes
                </span>
              </label>
            )}
          </div>

          <p className="font-body-sm text-on-surface-variant">
            A primeira imagem será a imagem principal. Máximo 5 imagens, 5MB cada.
          </p>
        </div>

        <div className="bg-background-surface border border-border-light rounded-xl p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 rounded border-border-light text-primary focus:ring-primary"
            />
            <div>
              <p className="font-label-md text-on-surface">Produto Activo</p>
              <p className="font-body-sm text-on-surface-variant">
                {formData.isActive 
                  ? 'O produto está visível para os clientes' 
                  : 'O produto está escondido dos clientes'}
              </p>
            </div>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/seller/products')}
            className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-xl font-label-md hover:bg-surface-container transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-[2] bg-primary text-on-primary py-4 rounded-xl font-label-md shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                A guardar...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                {isEditing ? 'Guardar Alterações' : 'Criar Produto'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}