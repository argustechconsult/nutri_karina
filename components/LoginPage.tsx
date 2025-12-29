
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ChevronLeft } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Enforcing admin/admin strictly as requested
    if (username === 'admin' && password === 'admin') {
      onLogin();
      navigate('/admin');
    } else {
      alert('Credenciais incorretas. Use admin / admin para acessar o sistema profissional.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-100/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-white relative">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-8 font-bold text-sm group">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Voltar para o site
        </Link>
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-teal-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-100">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Painel de Acesso</h2>
          <p className="text-slate-500 mt-2 font-medium">Controle clínico Soraia Psicologia</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Usuário</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4.5 pl-14 pr-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 font-semibold transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4.5 pl-14 pr-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 font-semibold transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 active:scale-95 mt-4"
          >
            Entrar no Painel
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-sm text-slate-400 font-medium">
            Problemas com acesso? Entre em contato com a administração.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
