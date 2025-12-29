
import React, { useState, useMemo } from 'react';
import { RefreshCw, MessageCircle, Mail, Sparkles, UserX, AlertCircle } from 'lucide-react';
import { Client } from '../types';
import { generateRetentionMessage } from '../services/geminiService';

interface RetentionProps {
  clients: Client[];
}

const RetentionTool: React.FC<RetentionProps> = ({ clients }) => {
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<{ clientId: string; message: string } | null>(null);

  const inactiveClients = useMemo(() => {
    // For demo purposes, we consider anyone with 'inactive' status 
    // OR anyone without a session in the last 60 days
    const today = new Date();
    return clients.filter(c => {
      if (c.status === 'inactive') return true;
      if (!c.lastSessionDate) return false;
      const last = new Date(c.lastSessionDate);
      const diffTime = Math.abs(today.getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 60;
    });
  }, [clients]);

  const handleGenerateAI = async (client: Client) => {
    setLoadingAI(client.id);
    const msg = await generateRetentionMessage(client.name, client.lastSessionDate);
    setAiResult({ clientId: client.id, message: msg || '' });
    setLoadingAI(null);
  };

  const shareWhatsApp = (phone: string, message: string) => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ferramenta de Retenção</h2>
          <p className="text-slate-500">Recupere pacientes que deixaram de se consultar recentemente.</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-2 text-blue-600 font-bold border border-blue-100">
          <UserX size={18} />
          {inactiveClients.length} Pacientes Inativos
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <AlertCircle size={20} className="text-orange-500" /> Pacientes para Contato
          </h3>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 divide-y divide-slate-50">
            {inactiveClients.map(client => (
              <div key={client.id} className={`p-6 flex items-center justify-between hover:bg-slate-50 transition-all ${aiResult?.clientId === client.id ? 'bg-teal-50' : ''}`}>
                <div>
                  <p className="font-bold text-slate-900">{client.name}</p>
                  <p className="text-xs text-slate-500">Última sessão: {client.lastSessionDate || 'Sem registro'}</p>
                </div>
                <button 
                  onClick={() => handleGenerateAI(client)}
                  disabled={loadingAI === client.id}
                  className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:border-teal-500 hover:text-teal-600 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingAI === client.id ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} className="text-teal-500" />}
                  Gerar Mensagem IA
                </button>
              </div>
            ))}
            {inactiveClients.length === 0 && (
              <div className="p-12 text-center text-slate-400 italic">Todos os seus pacientes estão em dia! Parabéns pelo excelente trabalho de retenção.</div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-4">
            <MessageCircle size={20} className="text-teal-500" /> Sugestão de Mensagem
          </h3>
          {aiResult ? (
            <div className="bg-white rounded-3xl shadow-sm border border-teal-100 p-8 space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">IA Soraia Assistent</p>
                  <p className="text-xs text-slate-500">Mensagem personalizada gerada agora</p>
                </div>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
                <p className="text-slate-800 leading-relaxed italic">"{aiResult.message}"</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => {
                    const client = clients.find(c => c.id === aiResult.clientId);
                    if (client) shareWhatsApp(client.phone, aiResult.message);
                  }}
                  className="flex-1 bg-green-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-green-100"
                >
                  <MessageCircle size={20} /> Enviar WhatsApp
                </button>
                <button className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                  <Mail size={20} /> Enviar E-mail
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-400">
              <Sparkles size={48} className="mx-auto mb-4 opacity-20" />
              <p>Selecione um paciente ao lado para gerar uma mensagem personalizada de reativação usando Inteligência Artificial.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RetentionTool;
