import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, Instagram, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BRAND_NAME, INSTAGRAM_HANDLE } from '../../types';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-brand-bg/80 backdrop-blur-md border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex justify-between h-24 items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-black tracking-tighter uppercase italic hover:opacity-80 transition-opacity">
                {BRAND_NAME}
              </Link>
            </div>
            
            <div className="hidden md:flex gap-8 items-center">
              <Link to="/" className="label-caps hover:text-brand-primary transition-all">Início</Link>
              <Link to="/catalog" className="label-caps hover:text-brand-primary transition-all">Coleção</Link>
              
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <a 
                href={`https://instagram.com/${INSTAGRAM_HANDLE}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-text opacity-40 hover:opacity-100 transition-opacity"
              >
                <Instagram size={18} />
              </a>
              <Link 
                to="/admin/dashboard" 
                className="w-1.5 h-1.5 bg-black/10 dark:bg-white/10 rounded-full hover:bg-brand-primary transition-colors"
                title="Admin"
              />
            </div>

            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`p-2 z-[70] relative transition-colors rounded-full ${isOpen ? 'bg-brand-primary text-black' : 'text-brand-text'}`}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-[60] bg-brand-bg md:hidden pt-24 overflow-y-auto"
          >
            <div className="flex flex-col p-12 space-y-8">
              <Link to="/" onClick={() => setIsOpen(false)} className="text-4xl font-black tracking-tighter uppercase italic">
                Início
              </Link>
              <Link to="/catalog" onClick={() => setIsOpen(false)} className="text-4xl font-black tracking-tighter uppercase italic">
                Coleção
              </Link>
              <div className="pt-8 border-t border-black/10 dark:border-white/10 flex flex-col space-y-6">
                <button 
                  onClick={() => { toggleTheme(); setIsOpen(false); }}
                  className="flex items-center gap-4 label-caps text-left"
                >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  <span>Modo {theme === 'light' ? 'Escuro' : 'Claro'}</span>
                </button>
                <a 
                  href={`https://instagram.com/${INSTAGRAM_HANDLE}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="label-caps inline-flex items-center gap-2"
                >
                  <Instagram size={16} />
                  <span>Siga no Instagram</span>
                </a>
                <Link 
                  to="/admin/dashboard" 
                  onClick={() => setIsOpen(false)} 
                  className="text-[10px] uppercase tracking-widest text-gray-400 font-medium"
                >
                  Painel Administrativo
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
