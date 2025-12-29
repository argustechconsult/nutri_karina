
import React, { useState, useMemo } from 'react';
import { 
  Search, FileText, ChevronRight, Save, Calendar, User, 
  BookOpen, PenTool, History, ArrowLeft, ClipboardList, 
  ChevronLeft, Layout, Sidebar as SidebarIcon,
  Stethoscope, Utensils, Ruler, Target, Activity
} from 'lucide-react';
import { Appointment, Client, SessionReport } from '../types';

interface ReportsProps {
  appointments: Appointment[];
  clients: Client[];
  reports: SessionReport[];
  setReports: React.Dispatch<React.SetStateAction<SessionReport[]>>;
}

const SessionReportManagement: React.FC<ReportsProps> = ({ appointments, clients, reports, setReports }) => {
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [editingReport, setEditingReport] = useState<{ appointmentId: string, clientId: string } | null>(null);
  const [formData, setFormData] = useState({ 
    observations: '', 
    evolution: '', 
    conduct: '',
    healthHistory: '',
    eatingHabits: '',
    anthropometrics: '',
    patientGoals: ''
  });
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const filteredClients = useMemo(() => {
    const clientsWithLastDate = clients.map(client => {
      const clientApps = appointments.filter(a => a.clientId === client.id);
      const lastApp = clientApps.length > 0 
        ? [...clientApps].sort((a, b) => b.date.localeCompare(a.date))[0]
        : null;
      
      return {
        ...client,
        lastDate: lastApp ? lastApp.date : '0000-00-00'
      };
    });

    const results = patientSearch.trim() 
      ? clientsWithLastDate.filter(c => 
          c.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
          c.email.toLowerCase().includes(patientSearch.toLowerCase())
        )
      : clientsWithLastDate;

    return results.sort((a, b) => b.lastDate.localeCompare(a.lastDate));
  }, [clients, appointments, patientSearch]);

  const clientAppointments = useMemo(() => {
    if (!selectedClientId) return [];
    return appointments
      .filter(app => app.clientId === selectedClientId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [appointments, selectedClientId]);

  const selectedClient = useMemo(() => 
    clients.find(c => c.id === selectedClientId)
  , [clients, selectedClientId]);

  const openEditor = (app: Appointment) => {
    const existing = reports.find(r => r.appointmentId === app.id);
    if (existing) {
      setFormData({ 
        observations: existing.observations || '', 
        evolution: existing.evolution || '', 
        conduct: existing.conduct || '',
        healthHistory: existing.healthHistory || '',
        eatingHabits: existing.eatingHabits || '',
        anthropometrics: existing.anthropometrics || '',
        patientGoals: existing.patientGoals || ''
      });
    } else {
      setFormData({ 
        observations: '', 
        evolution: '', 
        conduct: '',
        healthHistory: '',
        eatingHabits: '',
        anthropometrics: '',
        patientGoals: ''
      });
    }
    setEditingReport({ appointmentId: app.id, clientId: app.clientId });
  };

  const handleSave = () => {
    if (!editingReport) return;

    const newReport: SessionReport = {
      id: editingReport.appointmentId,
      appointmentId: editingReport.appointmentId,
      clientId: editingReport.clientId,
      date: new Date().toISOString(),
      content: `${formData.observations}\n${formData.evolution}\n${formData.conduct}`,
      ...formData
    };

    setReports(prev => {
      const filtered = prev.filter(r => r.appointmentId !== editingReport.appointmentId);
      return [...filtered, newReport];
    });

    setEditingReport(null);
  };

  if (editingReport) {
    const app = appointments.find(a => a.id === editingReport.appointmentId);
    return (
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col h-full animate-scale-up overflow-hidden">
        {/* Editor Inline Header */}
        <div className="p-8 border-b border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setEditingReport(null)}
              className="p-3 hover:bg-rose-50 rounded-2xl text-slate-400 hover:text-rose-500 transition-all border border-slate-100 group shadow-sm"
              title="Voltar ao Histórico"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-rose-400 text-white rounded-[1.2rem] flex items-center justify-center shadow-xl shadow-rose-100">
                <FileText size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Prontuário Nutricional</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-bold text-rose-500 bg-rose-50 px-3 py-0.5 rounded-full">{selectedClient?.name}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    {new Date((app?.date || '') + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setEditingReport(null)}
              className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all active:scale-95"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="bg-rose-400 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-rose-500 transition-all shadow-xl shadow-rose-100 active:scale-95"
            >
              <Save size={22} /> Salvar Prontuário
            </button>
          </div>
        </div>

        {/* Editor Inline Body */}
        <div className="flex-1 overflow-y-auto bg-[#FCFBF7] p-8 lg:p-14">
          <div className="max-w-6xl mx-auto space-y-12 pb-20">
            
            {/* 1 - Histórico de Saúde */}
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-500 flex items-center gap-3 ml-2">
                <Stethoscope size={18} /> 🏥 Histórico de saúde
              </label>
              <textarea 
                value={formData.healthHistory}
                onChange={(e) => setFormData({...formData, healthHistory: e.target.value})}
                placeholder="Doenças (HAS, DM, etc.), Histórico familiar, Cirurgias, Alergias, Intolerâncias, Medicamentos, Suplementos, Gastrointestinal..."
                className="w-full bg-white border border-slate-200 rounded-[2rem] p-8 min-h-[180px] focus:ring-8 focus:ring-rose-500/5 focus:border-rose-400 outline-none transition-all text-slate-800 leading-relaxed shadow-sm font-medium text-lg placeholder:text-slate-300"
              />
            </div>

            {/* 2 - Hábitos Alimentares */}
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-500 flex items-center gap-3 ml-2">
                <Utensils size={18} /> 🍽️ Hábitos alimentares
              </label>
              <textarea 
                value={formData.eatingHabits}
                onChange={(e) => setFormData({...formData, eatingHabits: e.target.value})}
                placeholder="Nº de refeições, Horários, Local, Consumo (Água, Refri, Álcool, Açúcar, Ultraprocessados), Preferências, Aversões, Restrições..."
                className="w-full bg-white border border-slate-200 rounded-[2rem] p-8 min-h-[180px] focus:ring-8 focus:ring-rose-500/5 focus:border-rose-400 outline-none transition-all text-slate-800 leading-relaxed shadow-sm font-medium text-lg placeholder:text-slate-300"
              />
            </div>

            {/* 3 - Avaliação Antropométrica */}
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-500 flex items-center gap-3 ml-2">
                <Ruler size={18} /> 📏 Avaliação antropométrica
              </label>
              <textarea 
                value={formData.anthropometrics}
                onChange={(e) => setFormData({...formData, anthropometrics: e.target.value})}
                placeholder="Peso atual, Altura, Peso usual, CC, CQ, Dobras cutâneas, Bioimpedância..."
                className="w-full bg-white border border-slate-200 rounded-[2rem] p-8 min-h-[120px] focus:ring-8 focus:ring-rose-500/5 focus:border-rose-400 outline-none transition-all text-slate-800 leading-relaxed shadow-sm font-medium text-lg placeholder:text-slate-300"
              />
            </div>

            {/* 5 - Objetivo do paciente */}
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-500 flex items-center gap-3 ml-2">
                <Target size={18} /> 🎯 Objetivo do paciente
              </label>
              <textarea 
                value={formData.patientGoals}
                onChange={(e) => setFormData({...formData, patientGoals: e.target.value})}
                placeholder="Emagrecimento, Ganho de massa, Saúde metabólica, Estética, Performance, Reeducação alimentar..."
                className="w-full bg-white border border-slate-200 rounded-[2rem] p-8 min-h-[120px] focus:ring-8 focus:ring-rose-500/5 focus:border-rose-400 outline-none transition-all text-slate-800 leading-relaxed shadow-sm font-medium text-lg placeholder:text-slate-300"
              />
            </div>

            {/* Clássicos: Evolução e Conduta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3 ml-2">
                  <Activity size={18} /> Evolução Terapêutica
                </label>
                <textarea 
                  value={formData.evolution}
                  onChange={(e) => setFormData({...formData, evolution: e.target.value})}
                  placeholder="Insights da sessão..."
                  className="w-full bg-white border border-slate-200 rounded-[2rem] p-6 min-h-[150px] focus:ring-8 focus:ring-rose-500/5 focus:border-rose-400 outline-none transition-all text-slate-800 leading-relaxed shadow-sm font-medium text-base placeholder:text-slate-300"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3 ml-2">
                  <PenTool size={18} /> Conduta e Planejamento
                </label>
                <textarea 
                  value={formData.conduct}
                  onChange={(e) => setFormData({...formData, conduct: e.target.value})}
                  placeholder="Próximos passos e metas..."
                  className="w-full bg-white border border-slate-200 rounded-[2rem] p-6 min-h-[150px] focus:ring-8 focus:ring-rose-500/5 focus:border-rose-400 outline-none transition-all text-slate-800 leading-relaxed shadow-sm font-medium text-base placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3 ml-2">
                Outras Observações
              </label>
              <textarea 
                value={formData.observations}
                onChange={(e) => setFormData({...formData, observations: e.target.value})}
                placeholder="Anotações gerais e lembretes..."
                className="w-full bg-white border border-slate-200 rounded-[2rem] p-6 min-h-[120px] focus:ring-8 focus:ring-rose-500/5 focus:border-rose-400 outline-none transition-all text-slate-800 leading-relaxed shadow-sm font-medium text-base placeholder:text-slate-300"
              />
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Selection Mode (Sidebar + History)
  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Prontuário e Evolução</h2>
          <p className="text-slate-500 text-sm">Gerencie o histórico nutricional e anotações de cada paciente.</p>
        </div>
        <button 
          onClick={() => setSidebarVisible(!sidebarVisible)}
          className="bg-white border border-slate-200 p-3 rounded-xl text-slate-500 hover:text-rose-500 transition-all shadow-sm hover:shadow-md flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
        >
          {sidebarVisible ? <SidebarIcon size={18} /> : <Layout size={18} />}
          {sidebarVisible ? 'Recolher Busca' : 'Mostrar Busca'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-[600px]">
        {/* Left Pane: Patient Search & Selection */}
        {sidebarVisible && (
          <div className={`lg:col-span-4 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden transition-all duration-300 ${selectedClientId && 'hidden lg:flex'}`}>
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                {patientSearch.trim() ? 'Resultados' : 'Últimos Atendimentos'}
              </h3>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Pesquisar paciente..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all text-sm"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {filteredClients.length > 0 ? (
                filteredClients.map(client => (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className={`w-full p-6 flex items-center gap-4 hover:bg-rose-50/30 transition-all text-left group ${selectedClientId === client.id ? 'bg-rose-50/50 border-r-4 border-rose-400' : ''}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm transition-all ${selectedClientId === client.id ? 'bg-rose-400 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-rose-100 group-hover:text-rose-500'}`}>
                      {client.name.charAt(0)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className={`font-bold truncate ${selectedClientId === client.id ? 'text-rose-900' : 'text-slate-700'}`}>{client.name}</p>
                      <p className="text-[10px] text-slate-400 truncate uppercase tracking-tighter">
                        Última consulta: {client.lastDate !== '0000-00-00' ? new Date(client.lastDate + 'T12:00:00').toLocaleDateString('pt-BR') : 'Sem registro'}
                      </p>
                    </div>
                    <ChevronRight size={18} className={`text-slate-300 transition-transform ${selectedClientId === client.id ? 'translate-x-1 text-rose-500' : ''}`} />
                  </button>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400 h-full flex flex-col justify-center items-center">
                  <User size={32} className="opacity-20 mb-2" />
                  <p className="text-xs font-bold uppercase tracking-widest text-center">Nenhum paciente</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Pane: History of Selected Patient */}
        <div className={`${sidebarVisible ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden transition-all duration-300`}>
          {selectedClientId ? (
            <>
              <div className="p-8 border-b border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedClientId(null)} 
                    className="p-2 hover:bg-slate-50 rounded-full text-slate-400"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <History className="text-rose-400" size={22} /> Histórico Clínico
                    </h3>
                    <p className="text-sm font-bold text-rose-500 mt-0.5">{selectedClient?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-rose-50 px-5 py-2 rounded-2xl border border-rose-100 shadow-sm">
                  <ClipboardList size={18} className="text-rose-400" />
                  <span className="text-xs font-black text-rose-500 uppercase tracking-widest">{clientAppointments.length} Consultas</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10">
                <div className="max-w-4xl mx-auto space-y-4">
                  {clientAppointments.map(app => {
                    const report = reports.find(r => r.appointmentId === app.id);
                    return (
                      <button 
                        key={app.id}
                        onClick={() => openEditor(app)}
                        className={`w-full group p-8 rounded-[2rem] border transition-all flex items-center justify-between text-left ${report ? 'bg-white border-slate-200 hover:border-rose-300 hover:shadow-xl hover:shadow-rose-50' : 'bg-slate-50/50 border-slate-100 border-dashed hover:bg-white hover:border-rose-200'}`}
                      >
                        <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${report ? 'bg-rose-50 text-rose-400 group-hover:bg-rose-400 group-hover:text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <Calendar size={28} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-xl tracking-tight">
                              {new Date(app.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </p>
                            <div className="flex items-center gap-4 mt-1.5">
                              <span className="text-xs font-black text-slate-400 flex items-center gap-1.5 uppercase tracking-widest"><PenTool size={14} /> {app.type}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                              {report ? (
                                <span className="text-xs font-black text-green-600 flex items-center gap-1.5 uppercase tracking-widest"><Save size={14} /> Prontuário Salvo</span>
                              ) : (
                                <span className="text-xs font-black text-orange-400 flex items-center gap-1.5 italic uppercase tracking-widest">Aguardando relato</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right mr-4 hidden sm:block">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Duração</p>
                            <p className="text-sm font-bold text-slate-500">{app.duration} min</p>
                          </div>
                          <ChevronRight className="text-slate-200 group-hover:text-rose-500 transition-transform group-hover:translate-x-2" size={28} />
                        </div>
                      </button>
                    );
                  })}
                  {clientAppointments.length === 0 && (
                    <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                      <BookOpen size={64} className="mx-auto mb-4 text-slate-100" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Nenhuma consulta realizada para este paciente.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-slate-50/20">
              <div className="w-32 h-32 bg-white rounded-[3rem] shadow-sm border border-slate-100 flex items-center justify-center mb-8">
                <User size={64} className="opacity-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Seleção de Paciente</h3>
              <p className="max-w-md mx-auto text-slate-500 font-medium">Selecione um paciente na lista lateral para visualizar e gerenciar seu histórico nutricional, medidas e hábitos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionReportManagement;
