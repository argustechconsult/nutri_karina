
import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Filter, Search } from 'lucide-react';
import { FinancialRecord } from '../types';

interface FinanceProps {
  finances: FinancialRecord[];
  setFinances: React.Dispatch<React.SetStateAction<FinancialRecord[]>>;
}

const FinancialManagement: React.FC<FinanceProps> = ({ finances, setFinances }) => {
  const [showModal, setShowModal] = useState(false);
  const [newRec, setNewRec] = useState<Partial<FinancialRecord>>({
    description: '', amount: 0, type: 'expense', date: new Date().toISOString().split('T')[0], category: 'Outros'
  });

  const totalIncome = finances.filter(f => f.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRec.description || !newRec.amount) return;
    
    const record: FinancialRecord = {
      id: Date.now().toString(),
      description: newRec.description!,
      amount: Number(newRec.amount),
      type: newRec.type as any,
      date: newRec.date!,
      category: newRec.category!
    };

    setFinances(prev => [...prev, record]);
    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Controle Financeiro</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
        >
          <Plus size={20} /> Nova Movimentação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Entradas</p>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <TrendingUp size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-900">R$ {totalIncome.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Saídas</p>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <TrendingDown size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-900">R$ {totalExpense.toLocaleString()}</p>
          </div>
        </div>
        <div className={`p-6 rounded-3xl border shadow-sm ${balance >= 0 ? 'bg-teal-600 border-teal-500 text-white' : 'bg-red-600 border-red-500 text-white'}`}>
          <p className="text-sm font-medium text-teal-100 mb-1">Saldo Líquido</p>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg text-white">
              <DollarSign size={20} />
            </div>
            <p className="text-2xl font-bold">R$ {balance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-slate-800">Fluxo de Caixa</h3>
            <div className="h-6 w-px bg-slate-200"></div>
            <span className="text-sm text-slate-500">{finances.length} registros</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><Search size={20} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><Filter size={20} /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">Data</th>
                <th className="px-8 py-4">Descrição</th>
                <th className="px-8 py-4">Categoria</th>
                <th className="px-8 py-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {finances.sort((a, b) => b.date.localeCompare(a.date)).map(rec => (
                <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 text-sm text-slate-500">{rec.date}</td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800">{rec.description}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">{rec.category}</span>
                  </td>
                  <td className="px-8 py-5 text-right font-bold">
                    <span className={rec.type === 'income' ? 'text-teal-600' : 'text-red-500'}>
                      {rec.type === 'income' ? '+' : '-'} R$ {rec.amount.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
              {finances.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400 italic">Nenhum registro financeiro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Lançar Movimentação</h3>
              <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-2 rounded-full transition-all">
                <Plus size={20} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Tipo</label>
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setNewRec({...newRec, type: 'income'})}
                    className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${newRec.type === 'income' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-100 text-slate-400'}`}
                  >Entrada</button>
                  <button 
                    type="button" 
                    onClick={() => setNewRec({...newRec, type: 'expense'})}
                    className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${newRec.type === 'expense' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-slate-100 text-slate-400'}`}
                  >Saída</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Descrição</label>
                <input 
                  type="text" 
                  required
                  value={newRec.description}
                  onChange={(e) => setNewRec({...newRec, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none"
                  placeholder="Ex: Aluguel Consultório, Testes WISC..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Valor (R$)</label>
                  <input 
                    type="number" 
                    required
                    value={newRec.amount}
                    onChange={(e) => setNewRec({...newRec, amount: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Data</label>
                  <input 
                    type="date" 
                    required
                    value={newRec.date}
                    onChange={(e) => setNewRec({...newRec, date: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition-all shadow-lg"
              >
                Confirmar Lançamento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialManagement;
