import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Columns,
  RefreshCw,
  LogOut,
  FileText,
  Calculator,
  Menu,
} from 'lucide-react';

interface AdminLayoutProps {
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col shrink-0 shadow-2xl transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Nutri Karina
            </h1>
            <p className="text-[9px] text-rose-400 uppercase tracking-[0.3em] font-black mt-1">
              Clínica & Comportamental
            </p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={20} className="rotate-180" />{' '}
            {/* Using LogOut as back/close icon temporarily or import X */}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <NavLink
            to="/admin"
            end
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-semibold ${
                isActive
                  ? 'bg-rose-400 text-white shadow-lg shadow-rose-900/40'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink
            to="/admin/clients"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-semibold ${
                isActive
                  ? 'bg-rose-400 text-white shadow-lg shadow-rose-900/40'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Users size={20} /> Pacientes
          </NavLink>
          <NavLink
            to="/admin/schedule"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-semibold ${
                isActive
                  ? 'bg-rose-400 text-white shadow-lg shadow-rose-900/40'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Calendar size={20} /> Agenda
          </NavLink>
          <NavLink
            to="/admin/calculators"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-semibold ${
                isActive
                  ? 'bg-rose-400 text-white shadow-lg shadow-rose-900/40'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Calculator size={20} /> Calculadoras
          </NavLink>
          <NavLink
            to="/admin/reports"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-semibold ${
                isActive
                  ? 'bg-rose-400 text-white shadow-lg shadow-rose-900/40'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <FileText size={20} /> Prontuário
          </NavLink>
          <NavLink
            to="/admin/kanban"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-semibold ${
                isActive
                  ? 'bg-rose-400 text-white shadow-lg shadow-rose-900/40'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Columns size={20} /> tarefas
          </NavLink>
          <NavLink
            to="/admin/finance"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-semibold ${
                isActive
                  ? 'bg-rose-400 text-white shadow-lg shadow-rose-900/40'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <DollarSign size={20} /> Financeiro
          </NavLink>
        </nav>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold border border-red-500/20"
          >
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#F8F1F1]/50">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-slate-500 hover:text-rose-400 transition-colors p-2 -ml-2"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800">Olá, Karina!</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-900">
                Karina Rodrigues
              </p>
              <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
                Nutricionista Clínica
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop"
              className="w-11 h-11 rounded-full border-2 border-rose-400 shadow-lg p-0.5"
              alt="Karina"
            />
          </div>
        </header>
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
