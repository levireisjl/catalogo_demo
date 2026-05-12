import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { Product, WHATSAPP_NUMBER } from '../types';
import { MessageCircle, ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    if (id) {
      productService.getProductById(id).then(item => {
        setProduct(item || null);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-24 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <h2 className="text-3xl font-serif mb-6 italic">Produto não encontrado</h2>
      <Link to="/catalog" className="btn-primary inline-block">Voltar ao Catálogo</Link>
    </div>
  );

  const whatsappMessage = encodeURIComponent(`Olá! Tenho interesse no produto "${product.name}" (Ref: ${product.id.slice(0,6).toUpperCase()}). 
Tamanho: ${selectedSize || 'Não selecionado'}
Cor: ${selectedColor || 'Não selecionada'}
Link: ${window.location.href}`);
  
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 lg:py-24">
      <Link to="/catalog" className="inline-flex items-center space-x-2 label-caps hover:text-brand-primary mb-12 transition-colors">
        <ArrowLeft size={14} />
        <span>Voltar ao Catálogo</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="relative aspect-[3/4] bg-brand-surface overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 group shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full cursor-zoom-in"
              >
                <motion.img
                  src={product.image_urls[activeImage] || 'https://via.placeholder.com/800x1066'}
                  alt={product.name}
                  whileHover={{ scale: 1.5 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="w-full h-full object-cover origin-center"
                />
              </motion.div>
            </AnimatePresence>
            
            {product.image_urls.length > 1 && (
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                <button 
                  onClick={() => setActiveImage(prev => (prev === 0 ? product.image_urls.length - 1 : prev - 1))}
                  className="bg-white/80 dark:bg-black/80 backdrop-blur-md p-4 rounded-full shadow-lg hover:bg-brand-primary hover:text-black transition-all pointer-events-auto active:scale-90"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setActiveImage(prev => (prev === product.image_urls.length - 1 ? 0 : prev + 1))}
                  className="bg-white/80 dark:bg-black/80 backdrop-blur-md p-4 rounded-full shadow-lg hover:bg-brand-primary hover:text-black transition-all pointer-events-auto active:scale-90"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Mobile Swipe Guide */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden">
              <div className="flex gap-2">
                {product.image_urls.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all ${activeImage === idx ? 'w-6 bg-brand-primary' : 'w-1.5 bg-white/40'}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {product.image_urls.map((url, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 ${activeImage === idx ? 'border-brand-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col pt-8 lg:pt-0">
          <div className="mb-10 border-b border-black/5 dark:border-white/10 pb-8">
            <div className="label-caps mb-4 text-brand-text border-l-4 border-brand-primary pl-4">{product.category}</div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic mb-4 text-brand-text">{product.name}</h1>
            <p className="text-3xl font-black text-black">
              <span className="bg-brand-primary px-4 py-1 rounded-sm">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </span>
            </p>
          </div>

          <div className="space-y-10 flex-grow">
            <div>
              <h3 className="label-caps mb-4">Disponibilidade</h3>
              {product.in_stock ? (
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-brand-text text-brand-bg rounded-full shadow-lg">
                   <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                   Em Estoque
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-red-50 text-red-600 rounded-full border border-red-100">Esgotado</span>
              )}
            </div>

            {product.sizes.length > 0 && (
              <div>
                <h3 className="label-caps mb-4">Escolha o Tamanho</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 px-6 flex items-center justify-center rounded-xl border text-[11px] font-bold tracking-widest uppercase transition-all shadow-sm ${
                        selectedSize === size 
                        ? 'bg-brand-text text-brand-bg border-brand-text shadow-lg scale-105' 
                        : 'bg-white dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-brand-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="prose prose-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-none">
              <h3 className="label-caps mb-4">Sobre a Peça</h3>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{product.description}</p>
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-black/5 dark:border-white/10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-center space-x-4 py-6 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase transition-all shadow-xl ${
                product.in_stock 
                ? 'bg-brand-primary text-black hover:bg-brand-text hover:text-brand-bg shadow-brand-primary/20 hover:scale-[1.01] active:scale-[0.99]' 
                : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed pointer-events-none'
              }`}
            >
              <MessageCircle size={20} />
              <span>{product.in_stock ? 'Comprar pelo WhatsApp' : 'Produto Indisponível'}</span>
            </a>
            <div className="flex justify-between items-center mt-8">
              <div className="text-[9px] font-mono opacity-40 uppercase">Atendimento humanizado</div>
              <div className="text-[9px] font-mono opacity-40 uppercase">REF: {product.id.toUpperCase()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
