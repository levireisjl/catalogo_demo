import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { Plus, Edit2, Trash2, ExternalLink, Package, LayoutDashboard, LogOut, Check } from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading: authLoading, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      productService.getAllProducts().then(items => {
        setProducts(items || []);
        setLoading(false);
      });
    }
  }, [isAdmin]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert('Erro ao excluir produto');
      }
    }
  };

  if (authLoading || loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-tight flex items-center">
            <LayoutDashboard className="mr-3 text-gray-400" size={24} />
            Painel de Controle
          </h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie seu catálogo e produtos.</p>
        </div>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <Link 
            to="/admin/products/new" 
            className="flex-grow md:flex-grow-0 flex items-center justify-center space-x-2 bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
          >
            <Plus size={16} />
            <span>Adicionar Produto</span>
          </Link>
          <button 
            onClick={() => logout()}
            className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Sair"
          >
            <LogOut size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
          <div className="flex items-center text-gray-400 text-xs uppercase font-bold tracking-widest mb-2">
            <Package size={14} className="mr-2" />
            Total de Produtos
          </div>
          <div className="text-3xl font-serif">{products.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
          <div className="flex items-center text-gray-400 text-xs uppercase font-bold tracking-widest mb-2">
            <Check size={14} className="mr-2 text-green-500" />
            Em Estoque
          </div>
          <div className="text-3xl font-serif">{products.filter(p => p.in_stock).length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
          <div className="flex items-center text-gray-400 text-xs uppercase font-bold tracking-widest mb-2">
            <Edit2 size={14} className="mr-2 text-purple-500" />
            Destaques
          </div>
          <div className="text-3xl font-serif">{products.filter(p => p.featured).length}</div>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Produto</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Preço</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img 
                        src={product.image_urls[0] || 'https://via.placeholder.com/100'} 
                        className="w-10 h-10 object-cover rounded-sm mr-3 bg-gray-100"
                        alt=""
                      />
                      <div>
                        <div className="font-medium text-sm text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-400 font-mono">ID: {product.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-semibold">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                       {product.in_stock ? (
                        <span className="bg-green-50 text-green-600 text-[10px] font-bold uppercase px-2 py-1 rounded">Em Estoque</span>
                      ) : (
                        <span className="bg-red-50 text-red-600 text-[10px] font-bold uppercase px-2 py-1 rounded">Esgotado</span>
                      )}
                      {product.featured && (
                        <span className="bg-purple-50 text-purple-600 text-[10px] font-bold uppercase px-2 py-1 rounded">Destaque</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        to={`/product/${product.id}`} 
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
                        title="Ver link público"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <Link 
                        to={`/admin/products/edit/${product.id}`} 
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                        title="Editar Produto"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                        title="Excluir Produto"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center text-gray-500 italic">
                    Nenhum produto no catálogo ainda. Clique em "Adicionar Produto" para começar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
