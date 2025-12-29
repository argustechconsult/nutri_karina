
import React from 'react';
import { Plus, GripVertical, Trash2, ArrowRight, ArrowLeft, CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import { KanbanTask } from '../types';

interface KanbanProps {
  tasks: KanbanTask[];
  setTasks: React.Dispatch<React.SetStateAction<KanbanTask[]>>;
}

const KanbanBoard: React.FC<KanbanProps> = ({ tasks, setTasks }) => {
  const columns: { id: KanbanTask['status']; label: string; color: string; icon: React.ReactNode }[] = [
    { id: 'todo', label: 'A Fazer', color: 'bg-slate-200', icon: <Circle size={16} className="text-slate-500" /> },
    { id: 'doing', label: 'Em Andamento', color: 'bg-blue-200', icon: <PlayCircle size={16} className="text-blue-500" /> },
    { id: 'done', label: 'Concluído', color: 'bg-teal-200', icon: <CheckCircle2 size={16} className="text-teal-500" /> }
  ];

  const moveTask = (taskId: string, newStatus: KanbanTask['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const addTask = (status: KanbanTask['status']) => {
    const title = prompt('Título da tarefa:');
    if (title) {
      setTasks(prev => [...prev, { id: Date.now().toString(), title, status }]);
    }
  };

  const removeTask = (id: string) => {
    if (window.confirm('Excluir esta tarefa?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const getMoveButtonStyle = (status: KanbanTask['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-slate-50 text-slate-600 hover:bg-slate-200 hover:text-slate-800 border-slate-200';
      case 'doing':
        return 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800 border-blue-100';
      case 'done':
        return 'bg-teal-50 text-teal-600 hover:bg-teal-100 hover:text-teal-800 border-teal-100';
      default:
        return 'bg-slate-50 text-slate-500';
    }
  };

  const getStatusLabel = (status: KanbanTask['status']) => {
    switch (status) {
      case 'todo': return 'A Fazer';
      case 'doing': return 'Andamento';
      case 'done': return 'Concluir';
    }
  };

  // Função para determinar a direção da seta baseada na posição das colunas
  const getDirectionIcon = (currentStatus: KanbanTask['status'], targetStatus: KanbanTask['status']) => {
    const statusOrder = ['todo', 'doing', 'done'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const targetIndex = statusOrder.indexOf(targetStatus);

    return targetIndex > currentIndex ? <ArrowRight size={10} className="shrink-0" /> : <ArrowLeft size={10} className="shrink-0" />;
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Fluxo de Trabalho</h2>
          <p className="text-sm text-slate-500 font-medium">Organize processos e tarefas clínicas da Dra. Soraia.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden pb-4">
        {columns.map(col => (
          <div key={col.id} className="bg-slate-100/50 rounded-[2rem] border border-slate-200 flex flex-col min-h-[600px] shadow-sm">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center shrink-0 bg-white/40 rounded-t-[2rem]">
              <div className="flex items-center gap-3">
                {col.icon}
                <h3 className="font-bold text-slate-700 tracking-tight">{col.label}</h3>
                <span className="text-[10px] font-black text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-full">
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </div>
              <button 
                onClick={() => addTask(col.id)}
                className="p-1.5 hover:bg-white rounded-xl text-slate-500 hover:text-teal-600 transition-all shadow-sm border border-transparent hover:border-slate-200"
                title="Adicionar tarefa nesta coluna"
              >
                <Plus size={18} />
              </button>
            </div>
            
            <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div 
                  key={task.id} 
                  className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 group transition-all hover:shadow-xl hover:border-teal-100 relative overflow-hidden animate-scale-up"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="cursor-grab active:cursor-grabbing text-slate-300 mt-1 hover:text-slate-400">
                        <GripVertical size={16} />
                      </div>
                      <p className="text-sm font-bold text-slate-800 leading-snug">{task.title}</p>
                    </div>
                    <button 
                      onClick={() => removeTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 p-1.5 transition-all rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2 pt-4 border-t border-slate-50">
                    <p className="w-full text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 ml-0.5">Mover para:</p>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {columns.filter(c => c.id !== col.id).map(c => (
                        <button 
                          key={c.id}
                          onClick={() => moveTask(task.id, c.id)}
                          className={`flex items-center justify-center gap-1.5 text-[10px] py-2 px-2 rounded-xl border font-bold transition-all active:scale-95 shadow-sm ${getMoveButtonStyle(c.id)}`}
                        >
                          {getDirectionIcon(task.status, c.id)}
                          {getStatusLabel(c.id)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              {tasks.filter(t => t.status === col.id).length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-3xl opacity-50">
                  <Plus size={24} className="mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Coluna Vazia</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
