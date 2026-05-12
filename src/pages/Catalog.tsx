import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { Product, CATEGORIES, Category } from '../types';
import ProductCard from '../components/ui/ProductCard';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as Category) || 'All';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getAllProducts().then(items => {
      setProducts(items || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = products;

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery]);

  const handleCategoryChange = (cat: Category) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-12 py-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 border-b border-black/5 dark:border-white/5 pb-8">
        <div>
           <h2 className="label-caps opacity-40 mb-2">Acesso ao Inventário</h2>
           <h1 className="text-6xl font-black tracking-tighter uppercase italic">Coleção Completa</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto items-end">
           {/* Search */}
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-brand-text transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="BUSCAR NO ARQUIVO..." 
              className="pl-6 pr-4 py-2 border-b border-black/10 dark:border-white/10 focus:border-brand-primary rounded-none text-[10px] font-bold tracking-widest uppercase focus:outline-none w-full bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Category Filter Desktop */}
          <div className="hidden lg:flex items-center space-x-2 border-b border-black/10 dark:border-white/10 pb-2">
            <span className="label-caps opacity-30">Filtrar:</span>
            <select 
              value={selectedCategory} 
              onChange={(e) => handleCategoryChange(e.target.value as Category)}
              className="bg-transparent text-[10px] font-bold tracking-widest uppercase border-none focus:ring-0 cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'Todos' : cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Category Scroll */}
      <div className="lg:hidden overflow-x-auto whitespace-nowrap pb-4 mb-8 flex space-x-6 no-scrollbar border-b border-black/5 dark:border-white/5">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`text-[10px] font-bold uppercase tracking-widest transition-all ${
              selectedCategory === cat ? 'opacity-100 border-b border-brand-text pb-1' : 'opacity-30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {[1, 2, 3, 4, 5, 6].map(idx => (
            <div key={idx} className="animate-pulse space-y-4">
              <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map(product => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-48 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl">
              <SlidersHorizontal className="mx-auto text-brand-text/20 mb-6" size={48} />
              <p className="label-caps opacity-40">Nenhum item corresponde aos parâmetros de busca.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="mt-6 text-[10px] font-black uppercase tracking-widest border-b border-brand-text pb-1"
              >
                Resetar Filtros
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
