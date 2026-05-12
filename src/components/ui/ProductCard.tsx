import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const createdAtMillis = product.created_at?.toMillis ? product.created_at.toMillis() : new Date(product.created_at).getTime();
  const isNew = product.created_at && (Date.now() - createdAtMillis < 7 * 24 * 60 * 60 * 1000);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group relative"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-[3/4] bg-brand-surface mb-6 rounded-2xl shadow-sm border border-black/5 dark:border-white/10">
          <img
            src={product.image_urls[0] || 'https://via.placeholder.com/600x800?text=Sem+Imagem'}
            alt={product.name}
            className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlay Info on Hover */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-white bg-linear-to-t from-black/60 to-transparent">
             <div className="label-caps !text-white !opacity-80 mb-1">Ref: {product.id.slice(0,6).toUpperCase()}</div>
             <div className="text-xl font-black tracking-tight uppercase italic">{product.name}</div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {!product.in_stock && (
              <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                Esgotado
              </span>
            )}
            {isNew && product.in_stock && (
              <span className="bg-brand-primary text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-brand-primary/20">
                Lançamento
              </span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-start group-hover:translate-x-1 transition-transform">
          <div>
            <p className="label-caps !text-[9px] mb-1">{product.category}</p>
            <h3 className="text-lg font-black tracking-tight uppercase leading-none text-brand-text/90">{product.name}</h3>
          </div>
          <p className="text-base font-bold text-black bg-brand-primary px-2 py-0.5 rounded-md">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
