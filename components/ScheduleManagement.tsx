
import React, { useState } from 'react';
import { Plus, X, Calendar as CalendarIcon, Clock, Check, Video, ExternalLink, DollarSign, Timer, Settings } from 'lucide-react';
import { Appointment, Client, FinancialRecord, GlobalSettings } from '../types';

interface ScheduleProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  clients: Client[];
  setFinances: React.Dispatch<React.SetStateAction<FinancialRecord[]>>;
  settings: GlobalSettings;
  setSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>;
}

const ScheduleManagement: React.FC<ScheduleProps> = ({ appointments, setAppointments, clients, setFinances, settings, setSettings }) => {
  const [showModal, setShowModal] = useState(false);
  const [newApp, setNewApp] = useState<Partial<Appointment>>({
    clientId: '', date: '', time: '', type: 'Clinical', status: 'scheduled', 
    price: settings.defaultPrice, duration: settings.defaultDuration
  });

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.clientId || !newApp.date || !newApp.time) return;

    const appointmentPrice = Number(newApp.price) || settings.defaultPrice;
    const client = clients.find(c => c.id === newApp.clientId);

    const app: Appointment = {
      id: Date.now().toString(),
      clientId: newApp.clientId!,
      date: newApp.date!,
      time: newApp.time!,
      type: newApp.type as any || 'Clinical',
      status: 'scheduled',
      meetLink: `https://meet.google.com/karina-${Math.random().toString(36).substring(7)}`,
      price: appointmentPrice,
      duration: Number(newApp.duration) || settings.defaultDuration
    };

    setAppointments(prev => [...prev, app]);

    const financialRecord: FinancialRecord = {
      id: `f-${Date.now()}`,
      description: `Agendamento Manual (${app.type}) - ${client?.name || 'Cliente'}`,
      amount: appointmentPrice,
      type: 'income',
      date: newApp.date!,
      category: 'Atendimento'
    };
    setFinances(prev => [...prev, financialRecord]);

    setShowModal(false);
    setNewApp({ clientId: '', date: '', time: '', type: 'Clinical', status: 'scheduled', price: settings.defaultPrice, duration: settings.defaultDuration });
  };

  const markCompleted = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'completed' } : a));
  };

  const handleTypeChange = (type: 'Clinical' | 'Behavioral') => {
    const defaultPrice = settings.defaultPrice;
    const defaultDuration = settings.defaultDuration;
    setNewApp({ ...newApp, type, price: defaultPrice, duration: defaultDuration });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Agendamentos</h2>
          <p className="text-sm text-slate-500">Gestão 100% interna de horários e receitas.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-rose-400 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-rose-500 transition-all shadow-lg shadow-rose-100"
        >
          <Plus size={20} /> Novo Agendamento
        </button>
      </div>

      {/* Global Settings Panel */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-400 rounded-2xl">
            <Settings size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Configurações de Consulta</h3>
            <p className="text-xs text-slate-400">Padrões aplicados ao site e novos registros.</p>
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="relative">
            <Timer className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <div className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Duração (min)</span>
              <input 
                type="number"
                value={settings.defaultDuration}
                onChange={(e) => setSettings({...settings, defaultDuration: Number(e.target.value)})}
                className="w-16 bg-transparent text-right font-black text-rose-500 outline-none"
              />
            </div>
          </div>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <div className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Valor (R$)</span>
              <input 
                type="number"
                value={settings.defaultPrice}
                onChange={(e) => setSettings({...settings, defaultPrice: Number(e.target.value)})}
                className="w-20 bg-transparent text-right font-black text-rose-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        <h3 className="col-span-full font-bold text-slate-800 text-lg flex items-center gap-2">
          <Clock size={20} className="text-rose-400" /> Próximas Sessões
        </h3>
        {appointments.length > 0 ? (
          appointments
            .filter(app => app.status !== 'cancelled')
            .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
            .map(app => {
              const client = clients.find(c => c.id === app.clientId);
              return (
                <div key={app.id} className={`p-6 rounded-3xl border transition-all ${app.status === 'completed' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-rose-100 shadow-sm shadow-rose-50'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${app.type === 'Clinical' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                      {app.type === 'Clinical' ? 'Clínica' : 'Comport.'}
                    </div>
                    {app.status === 'scheduled' && (
                      <button 
                        onClick={() => markCompleted(app.id)}
                        className="text-rose-400 hover:bg-rose-50 p-2 rounded-lg transition-all"
                        title="Marcar como realizada"
                      >
                        <Check size={20} />
                      </button>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-4 truncate">{client?.name || 'Cliente'}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={16} className="text-rose-400" />
                        <span className="text-sm font-medium">{new Date(app.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-rose-400" />
                        <span className="text-sm font-medium">{app.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Timer size={14} />
                        <span className="text-xs font-bold">{app.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-rose-500">
                        <DollarSign size={14} />
                        <span className="text-xs font-black">R$ {app.price}</span>
                      </div>
                    </div>

                    {app.meetLink && app.status === 'scheduled' && (
                       <a 
                        href={app.meetLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 text-white bg-slate-900 py-3 px-3 rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all mt-2 shadow-md"
                       >
                         <Video size={18} /> Sala Virtual <ExternalLink size={12} />
                       </a>
                    )}
                  </div>
                </div>
              );
            })
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
            <CalendarIcon size={48} className="mx-auto mb-3 opacity-10" />
            <p className="font-bold text-sm uppercase tracking-widest">Nenhum compromisso agendado</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-rose-400 text-white">
              <h3 className="text-xl font-bold">Novo Agendamento</h3>
              <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-2 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddAppointment} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Paciente</label>
                <select 
                  required
                  value={newApp.clientId}
                  onChange={(e) => setNewApp({...newApp, clientId: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-rose-200 outline-none"
                >
                  <option value="">Selecione o paciente</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Data</label>
                  <input 
                    type="date"
                    required
                    value={newApp.date}
                    onChange={(e) => setNewApp({...newApp, date: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-rose-200 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Horário</label>
                  <input 
                    type="time"
                    required
                    value={newApp.time}
                    onChange={(e) => setNewApp({...newApp, time: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-rose-200 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <label className="text-sm font-bold text-slate-700">Tipo de Atendimento</label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" name="type" className="hidden peer" checked={newApp.type === 'Clinical'} onChange={() => handleTypeChange('Clinical')} />
                    <div className="p-3 border border-slate-200 rounded-xl text-center peer-checked:bg-rose-50 peer-checked:border-rose-400 peer-checked:text-rose-600 font-bold transition-all text-sm">Clínica</div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" name="type" className="hidden peer" checked={newApp.type === 'Behavioral'} onChange={() => handleTypeChange('Behavioral')} />
                    <div className="p-3 border border-slate-200 rounded-xl text-center peer-checked:bg-rose-50 peer-checked:border-rose-400 peer-checked:text-rose-600 font-bold transition-all text-sm">Comportamental</div>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Valor (R$)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input type="number" value={newApp.price} onChange={(e) => setNewApp({...newApp, price: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-9 pr-4 focus:ring-2 focus:ring-rose-200 outline-none font-bold" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Duração (min)</label>
                    <div className="relative">
                      <Timer className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input type="number" value={newApp.duration} onChange={(e) => setNewApp({...newApp, duration: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-9 pr-4 focus:ring-2 focus:ring-rose-200 outline-none font-bold" />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-rose-400 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-500 transition-all shadow-lg active:scale-95">
                Salvar e Gerar Receita
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
