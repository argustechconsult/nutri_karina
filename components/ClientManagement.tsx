
import React, { useState } from 'react';
import { Plus, Search, MoreHorizontal, Mail, Phone, MapPin, X, Edit2, Trash2 } from 'lucide-react';
import { Client } from '../types';

interface ClientManagementProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ clients, setClients }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '', address: '', phone: '', email: '', status: 'active', treatmentStage: 'First Contact'
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingClient(null);
    setFormData({ name: '', address: '', phone: '', email: '', status: 'active', treatmentStage: 'First Contact' });
    setShowModal(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({ ...client });
    setShowModal(true);
    setActiveMenu(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente? Todos os dados associados serão perdidos.')) {
      setClients(prev => prev.filter(c => c.id !== id));
      setActiveMenu(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    if (editingClient) {
      setClients(prev => prev.map(c => c.id === editingClient.id ? { ...c, ...formData } as Client : c));
    } else {
      const client: Client = {
        id: Date.now().toString(),
        name: formData.name!,
        address: formData.address || '',
        phone: formData.phone || '',
        email: formData.email || '',
        status: 'active',
        treatmentStage: 'First Contact',
      };
      setClients(prev => [...prev, client]);
    }

    setShowModal(false);
    setFormData({ name: '', address: '', phone: '', email: '', status: 'active', treatmentStage: 'First Contact' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Gestão de Clientes</h2>
        <button 
          onClick={handleOpenAdd}
          className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
        >
          <Plus size={20} /> Novo Cliente
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Endereço</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{client.name}</p>
                        <p className="text-xs text-slate-500">{client.treatmentStage}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-600 flex items-center gap-2"><Phone size={14} className="text-slate-400" /> {client.phone}</p>
                      <p className="text-sm text-slate-600 flex items-center gap-2"><Mail size={14} className="text-slate-400" /> {client.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm text-slate-600 flex items-center gap-2"><MapPin size={14} className="text-slate-400 shrink-0" /> {client.address}</p>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${client.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {client.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === client.id ? null : client.id)}
                      className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-all"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                    
                    {activeMenu === client.id && (
                      <div className="absolute right-6 top-16 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 py-2 animate-fade-in">
                        <button 
                          onClick={() => handleOpenEdit(client)}
                          className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                        >
                          <Edit2 size={16} className="text-blue-500" /> Editar Dados
                        </button>
                        <button 
                          onClick={() => handleDelete(client.id)}
                          className="w-full px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                        >
                          <Trash2 size={16} /> Excluir Cliente
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClients.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              Nenhum cliente encontrado.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Client Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-teal-600 text-white">
              <h3 className="text-xl font-bold">{editingClient ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}</h3>
              <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-2 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nome Completo</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Telefone / WhatsApp</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="(21) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Endereço</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="Rua, Número, Bairro"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Fase do Tratamento</label>
                  <select 
                    value={formData.treatmentStage}
                    onChange={(e) => setFormData({...formData, treatmentStage: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="First Contact">Primeiro Contato</option>
                    <option value="Evaluation">Em Avaliação</option>
                    <option value="In Treatment">Em Tratamento</option>
                    <option value="Discharged">Alta</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
                >
                  {editingClient ? 'Atualizar Dados' : 'Salvar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Backdrop for Menu closing */}
      {activeMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
};

export default ClientManagement;
