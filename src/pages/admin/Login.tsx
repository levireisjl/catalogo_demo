import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Key, Mail } from 'lucide-react';
import { BRAND_NAME } from '../../types';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulated login logic
    setTimeout(() => {
      if (email === 'admin@vogue.com' && password === 'admin123') {
        login(email);
        navigate('/admin/dashboard');
      } else {
        setError('E-mail ou senha incorretos. (Dica: admin@vogue.com / admin123)');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbfbf9] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif tracking-tighter mb-2 italic">{BRAND_NAME}</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Portal de Gestão</p>
        </div>

        <form onSubmit={handleMockLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-[11px] p-4 rounded-xl border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@vogue.com"
                className="w-full bg-gray-50 border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-black transition-all outline-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Senha</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-gray-50 border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-black transition-all outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-black text-white rounded-xl font-bold text-[11px] tracking-[0.2em] uppercase hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg shadow-black/10 active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={18} />
                <span>Entrar no Sistema</span>
              </>
            )}
          </button>
        </form>

        <p className="text-[9px] text-gray-400 mt-10 text-center leading-relaxed uppercase tracking-wider opacity-60">
          Uso exclusivo para administradores do catalogo.<br />
          Ambiente de demonstração local.
        </p>
      </div>
    </div>
  );
}
