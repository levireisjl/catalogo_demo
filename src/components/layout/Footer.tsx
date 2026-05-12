import { BRAND_NAME, BRAND_DESC } from '../../types';

export default function Footer() {
  return (
    <footer className="bg-brand-bg border-t border-black/5 dark:border-white/5 py-16 px-12 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 items-end">
        <div className="space-y-6">
          <h2 className="text-2xl font-black tracking-tighter uppercase italic">{BRAND_NAME}</h2>
          <p className="text-sm font-serif italic text-brand-text opacity-70 leading-relaxed max-w-xs">
            {BRAND_DESC}
          </p>
        </div>
        
        <div className="flex gap-16">
          <div>
            <h3 className="label-caps opacity-40 mb-4">Navegação</h3>
            <ul className="space-y-2 text-[11px] font-bold uppercase tracking-widest">
              <li><a href="/" className="hover:opacity-60 transition-opacity">Início</a></li>
              <li><a href="/catalog" className="hover:opacity-60 transition-opacity">Coleção</a></li>
              <li><a href="/admin/login" className="hover:opacity-60 transition-opacity">Portal</a></li>
            </ul>
          </div>
          <div>
            <h3 className="label-caps opacity-40 mb-4">Estoque</h3>
            <div className="text-[10px] font-mono opacity-80 uppercase tracking-tighter">
              Vault_01 / Ativo
            </div>
          </div>
        </div>

        <div className="md:text-right">
          <h3 className="label-caps opacity-40 mb-4">Contato</h3>
          <p className="text-[10px] font-mono opacity-60 leading-relaxed uppercase">
            © {new Date().getFullYear()} {BRAND_NAME}<br />
            Curadoria extremamente minimalista.
          </p>
        </div>
      </div>
    </footer>
  );
}
