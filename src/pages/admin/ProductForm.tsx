import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/productService';
import { Product, CATEGORIES, Category } from '../../types';
import { ArrowLeft, Save, X, Plus, Upload, Loader2, Info } from 'lucide-react';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading: authLoading, isAdmin } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(!!id);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'created_at'>>({
    name: '',
    price: 0,
    description: '',
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black'],
    image_urls: [],
    featured: false,
    in_stock: true,
  });

  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');

  useEffect(() => {
    if (!authLoading && !isAdmin && isAdmin !== undefined) {
      navigate('/admin/login');
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (id) {
      productService.getProductById(id).then(item => {
        if (item) {
          const { id: _, created_at: __, ...rest } = item as any;
          setFormData(rest);
        }
        setDataLoading(false);
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await productService.updateProduct(id, formData);
      } else {
        await productService.createProduct(formData);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      alert('Erro ao salvar produto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const urls = await Promise.all(
        Array.from(files).map((file: any) => productService.uploadImage(file))
      );
      setFormData(prev => ({
        ...prev,
        image_urls: [...prev.image_urls, ...urls]
      }));
    } catch (err) {
      alert('Erro ao carregar imagens');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index)
    }));
  };

  const addSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData(prev => ({ ...prev, sizes: [...prev.sizes, newSize] }));
      setNewSize('');
    }
  };

  const addColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData(prev => ({ ...prev, colors: [...prev.colors, newColor] }));
      setNewColor('');
    }
  };

  if (dataLoading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <Link to="/admin/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-black">
          <ArrowLeft size={16} className="mr-2" />
          Voltar ao Painel
        </Link>
        <h1 className="text-2xl font-serif tracking-tight">
          {id ? 'Editar Produto' : 'Criar Novo Produto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl border border-gray-100 shadow-xs">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Nome do Produto</label>
            <input 
              required
              type="text" 
              className="w-full border-b border-gray-200 py-2 focus:border-black focus:outline-none transition-colors"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Preço (R$)</label>
            <input 
              required
              type="number" 
              step="0.01"
              className="w-full border-b border-gray-200 py-2 focus:border-black focus:outline-none transition-colors"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Descrição</label>
          <textarea 
            rows={3}
            className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-lg focus:bg-white focus:border-black focus:outline-none transition-all"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Categoria</label>
            <select 
              className="w-full border-b border-gray-200 py-2 focus:border-black focus:outline-none bg-transparent"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
            >
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-8 pt-4">
            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={formData.featured}
                  onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${formData.featured ? 'bg-black' : 'bg-gray-200'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.featured ? 'translate-x-4' : ''}`}></div>
              </div>
              <span className="ml-3 text-sm font-medium">Item em Destaque</span>
            </label>

            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={formData.in_stock}
                  onChange={e => setFormData({ ...formData, in_stock: e.target.checked })}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${formData.in_stock ? 'bg-black' : 'bg-gray-200'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.in_stock ? 'translate-x-4' : ''}`}></div>
              </div>
              <span className="ml-3 text-sm font-medium">Em Estoque</span>
            </label>
          </div>
        </div>

        {/* Variations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
          <div className="space-y-4">
             <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Tamanhos</label>
             <div className="flex flex-wrap gap-2 mb-2">
               {formData.sizes.map(size => (
                 <span key={size} className="inline-flex items-center bg-gray-100 px-3 py-1 text-xs font-bold rounded">
                   {size}
                   <button type="button" onClick={() => setFormData(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== size) }))} className="ml-2 text-gray-400 hover:text-red-500">
                     <X size={12} />
                   </button>
                 </span>
               ))}
             </div>
             <div className="flex space-x-2">
               <input 
                 type="text" 
                 placeholder="Adicionar tamanho (ex: G)" 
                 className="flex-grow border-b border-gray-200 py-1 text-sm focus:outline-none"
                 value={newSize}
                 onChange={e => setNewSize(e.target.value)}
                 onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSize())}
               />
               <button type="button" onClick={addSize} className="p-1 hover:text-black text-gray-400"><Plus size={18} /></button>
             </div>
          </div>

          <div className="space-y-4">
             <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Cores</label>
             <div className="flex flex-wrap gap-2 mb-2">
               {formData.colors.map(color => (
                 <span key={color} className="inline-flex items-center bg-gray-100 px-3 py-1 text-xs font-bold rounded">
                   {color}
                   <button type="button" onClick={() => setFormData(prev => ({ ...prev, colors: prev.colors.filter(c => c !== color) }))} className="ml-2 text-gray-400 hover:text-red-500">
                     <X size={12} />
                   </button>
                 </span>
               ))}
             </div>
             <div className="flex space-x-2">
               <input 
                 type="text" 
                 placeholder="Adicionar cor (ex: Preto)" 
                 className="flex-grow border-b border-gray-200 py-1 text-sm focus:outline-none"
                 value={newColor}
                 onChange={e => setNewColor(e.target.value)}
                 onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addColor())}
               />
               <button type="button" onClick={addColor} className="p-1 hover:text-black text-gray-400"><Plus size={18} /></button>
             </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <label className="text-xs uppercase font-bold tracking-widest text-gray-400 flex items-center">
            Imagens do Produto
            <span className="ml-2 text-[10px] lowercase font-normal italic flex items-center">
              <Info size={10} className="mr-1" /> A primeira imagem será a capa
            </span>
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {formData.image_urls.map((url, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded group overflow-hidden border border-gray-100">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-white/90 p-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                >
                  <X size={14} />
                </button>
                {index === 0 && <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center py-1 font-bold uppercase tracking-widest">Capa</div>}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="aspect-square border-2 border-dashed border-gray-200 rounded flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all group"
            >
              {uploading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} className="group-hover:-translate-y-1 transition-transform" />}
              <span className="text-[10px] font-bold uppercase tracking-widest mt-2">{uploading ? 'Carregando...' : 'Adicionar Imagens'}</span>
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            accept="image/*" 
            onChange={handleImageUpload}
          />
        </div>

        <div className="pt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex items-center space-x-2 bg-black text-white px-12 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-gray-800 transition-all disabled:opacity-50 shadow-lg shadow-black/10"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>{loading ? 'Salvando Alterações...' : 'Salvar Produto'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
