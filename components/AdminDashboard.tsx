
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Calendar, DollarSign, TrendingUp, UserCheck, AlertCircle } from 'lucide-react';
import { Client, Appointment, FinancialRecord } from '../types';

interface DashboardProps {
  clients: Client[];
  appointments: Appointment[];
  finances: FinancialRecord[];
}

const AdminDashboard: React.FC<DashboardProps> = ({ clients, appointments, finances }) => {
  const activeClients = clients.filter(c => c.status === 'active').length;
  
  const currentMonth = new Date().getMonth();
  const attendedThisMonth = appointments.filter(a => {
    const d = new Date(a.date);
    return d.getMonth() === currentMonth && a.status === 'completed';
  }).length;

  const totalRevenue = useMemo(() => 
    finances.filter(f => f.type === 'income').reduce((acc, curr) => acc + curr.amount, 0)
  , [finances]);

  const totalExpenses = useMemo(() => 
    finances.filter(f => f.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0)
  , [finances]);

  const chartData = [
    { name: 'Jan', receita: 4000, despesa: 2400 },
    { name: 'Fev', receita: 3000, despesa: 1398 },
    { name: 'Mar', receita: 2000, despesa: 9800 },
    { name: 'Abr', receita: 2780, despesa: 3908 },
    { name: 'Mai', receita: 1890, despesa: 4800 },
    { name: 'Jun', receita: 2390, despesa: 3800 },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
              <Users size={24} />
            </div>
            <span className="text-xs font-bold text-green-500 bg-green-100 px-2 py-1 rounded-lg">+12%</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total de Clientes</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{clients.length}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-teal-100 rounded-2xl text-teal-600">
              <UserCheck size={24} />
            </div>
            <span className="text-xs font-bold text-teal-500 bg-teal-100 px-2 py-1 rounded-lg">Foco Mês</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Atendidos (Mês)</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{attendedThisMonth}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-100 rounded-2xl text-green-600">
              <DollarSign size={24} />
            </div>
            <span className="text-xs font-bold text-slate-400 italic">Total Hist.</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Receita Total</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">R$ {totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-100 rounded-2xl text-red-600">
              <AlertCircle size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Despesas Totais</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">R$ {totalExpenses.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Desempenho Financeiro (Simulado)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="receita" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesa" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Crescimento de Pacientes</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Line type="monotone" dataKey="receita" stroke="#0ea5e9" strokeWidth={3} dot={{r: 6}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Agendamentos Próximos</h3>
          <button className="text-teal-600 text-sm font-bold hover:underline">Ver todos</button>
        </div>
        <div className="divide-y divide-slate-50">
          {appointments.length > 0 ? appointments.slice(0, 5).map(app => {
            const client = clients.find(c => c.id === app.clientId);
            return (
              <div key={app.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
                    {client?.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{client?.name}</p>
                    <p className="text-xs text-slate-500">{app.type} • {app.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{app.time}</p>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-bold uppercase tracking-wider">Agendado</span>
                </div>
              </div>
            );
          }) : (
            <div className="p-12 text-center text-slate-400">
              <Calendar size={48} className="mx-auto mb-4 opacity-20" />
              <p>Nenhum agendamento futuro encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
