import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { Product, CATEGORIES, BRAND_NAME } from '../types';
import ProductCard from '../components/ui/ProductCard';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getFeaturedProducts().then(products => {
      setFeatured(products || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative px-6 md:px-12 py-12 md:py-24 flex flex-col md:flex-row items-center gap-12 md:gap-16 min-h-[80vh]">
        <div className="flex-1 flex flex-col justify-center text-center md:text-left items-center md:items-start order-2 md:order-1">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[60px] sm:text-[80px] md:text-[140px] text-display mb-6 md:mb-8 text-brand-text"
          >
            ESTILO<br/>
            <span className="text-brand-primary drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]">VIBRANTE</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg leading-relaxed max-w-[320px] text-gray-600 dark:text-gray-400 mb-10 md:mb-12 font-medium mx-auto md:mx-0"
          >
            Peças exclusivas e cheias de vida para quem não tem medo de se destacar.
          </motion.p>
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="flex gap-4"
          >
            <Link 
              to="/catalog" 
              className="px-10 py-5 bg-brand-secondary text-white label-caps transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-xl shadow-brand-secondary/20 rounded-2xl group"
            >
              <span>Explorar Coleção</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="flex-1 w-full aspect-[3/4] overflow-hidden relative group order-1 md:order-2 rounded-3xl shadow-2xl border border-black/5 dark:border-white/10">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero" 
            className="w-full h-full object-cover brightness-110 group-hover:scale-110 transition-transform duration-1000"
          />
          <div className="absolute bottom-8 right-8 text-display text-white text-5xl md:text-6xl opacity-40 select-none">
            01/SS
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-12 md:mt-24">
        <div className="flex justify-between items-end mb-12 md:mb-16 border-b border-black/5 dark:border-white/5 pb-8">
          <div>
            <h2 className="label-caps opacity-40 mb-2">Seleção Curada</h2>
            <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic">Destaques</h3>
          </div>
          <Link to="/catalog" className="label-caps border-b border-brand-text pb-1 hover:opacity-50 transition-all text-[9px] md:text-[10px]">
            Ver Tudo
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map(idx => (
              <div key={idx} className="animate-pulse space-y-4">
                <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 w-3/4 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featured.length > 0 ? (
              featured.slice(0, 3).map(product => (
                <motion.div key={product.id} layout>
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-12 label-caps opacity-40">Sem itens no arquivo.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
