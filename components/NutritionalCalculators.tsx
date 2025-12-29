
import React, { useState, useMemo } from 'react';
import { Calculator, Activity, Ruler, Utensils, Zap, Heart, Droplets, ArrowRight } from 'lucide-react';

const NutritionalCalculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'energy' | 'composition' | 'macros'>('energy');

  // Input States
  const [data, setData] = useState({
    weight: 70,
    height: 170,
    age: 30,
    gender: 'female' as 'male' | 'female',
    activityFactor: 1.2, // Sedentário
    waist: 80,
    hip: 100,
    proteinPerKg: 2.0,
    fatPercent: 25,
    goal: 'maintenance' as 'loss' | 'gain' | 'maintenance'
  });

  // 1. Metabolic & Energy Calculations
  const calculations = useMemo(() => {
    const { weight, height, age, gender, activityFactor } = data;
    
    // Mifflin-St Jeor
    let tmbMifflin = (10 * weight) + (6.25 * height) - (5 * age);
    tmbMifflin = gender === 'male' ? tmbMifflin + 5 : tmbMifflin - 161;

    // Harris-Benedict
    let tmbHarris = gender === 'male' 
      ? 66.5 + (13.75 * weight) + (5.003 * height) - (6.75 * age)
      : 655.1 + (9.563 * weight) + (1.85 * height) - (4.676 * age);

    const get = tmbMifflin * activityFactor;
    
    // Water intake (35ml/kg)
    const water = weight * 35;

    // IMC
    const heightInMeters = height / 100;
    const imc = weight / (heightInMeters * heightInMeters);

    // ICQ (Waist to Hip)
    const icq = data.waist / data.hip;

    // Waist-to-Height
    const rcest = data.waist / height;

    return { tmbMifflin, tmbHarris, get, water, imc, icq, rcest };
  }, [data]);

  const imcClassification = (imc: number) => {
    if (imc < 18.5) return { label: 'Baixo Peso', color: 'text-blue-500' };
    if (imc < 25) return { label: 'Eutrofia (Peso Ideal)', color: 'text-green-500' };
    if (imc < 30) return { label: 'Sobrepeso', color: 'text-yellow-500' };
    if (imc < 35) return { label: 'Obesidade Grau I', color: 'text-orange-500' };
    if (imc < 40) return { label: 'Obesidade Grau II', color: 'text-red-500' };
    return { label: 'Obesidade Grau III', color: 'text-red-700' };
  };

  const activityLabels: Record<number, string> = {
    1.2: 'Sedentário (Pouco ou nenhum exercício)',
    1.375: 'Levemente Ativo (Exercício leve 1-3 dias/sem)',
    1.55: 'Moderadamente Ativo (Exercício moderado 3-5 dias/sem)',
    1.725: 'Muito Ativo (Exercício pesado 6-7 dias/sem)',
    1.9: 'Extremamente Ativo (Trabalho físico ou treino intenso 2x/dia)'
  };

  // 2. Macronutrient Distribution
  const macros = useMemo(() => {
    const totalKcal = calculations.get;
    const protGrams = data.weight * data.proteinPerKg;
    const protKcal = protGrams * 4;
    
    const fatKcal = totalKcal * (data.fatPercent / 100);
    const fatGrams = fatKcal / 9;

    const carbKcal = totalKcal - protKcal - fatKcal;
    const carbGrams = carbKcal / 4;

    return {
      prot: { g: protGrams, kcal: protKcal, pct: (protKcal / totalKcal) * 100 },
      fat: { g: fatGrams, kcal: fatKcal, pct: data.fatPercent },
      carb: { g: carbGrams, kcal: carbKcal, pct: (carbKcal / totalKcal) * 100 },
      fiber: (totalKcal / 1000) * 14 // Recomendação comum de 14g por 1000kcal
    };
  }, [calculations.get, data.weight, data.proteinPerKg, data.fatPercent]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Calculator className="text-rose-400" size={28} /> Central de Cálculos Nutricionais
          </h2>
          <p className="text-slate-500 text-sm">Ferramentas de precisão para planejamento clínico da Dra. Karina.</p>
        </div>
        
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 flex gap-1 shadow-sm">
          {(['energy', 'composition', 'macros'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-rose-400 text-white shadow-lg shadow-rose-100' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              {tab === 'energy' ? 'Metabolismo' : tab === 'composition' ? 'Composição' : 'Planejamento'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Global Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Dados do Paciente</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Peso (kg)</label>
                <input type="number" value={data.weight} onChange={(e) => setData({...data, weight: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 font-bold text-slate-800 focus:ring-2 focus:ring-rose-200 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Altura (cm)</label>
                <input type="number" value={data.height} onChange={(e) => setData({...data, height: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 font-bold text-slate-800 focus:ring-2 focus:ring-rose-200 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Idade</label>
                <input type="number" value={data.age} onChange={(e) => setData({...data, age: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 font-bold text-slate-800 focus:ring-2 focus:ring-rose-200 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Gênero</label>
                <select value={data.gender} onChange={(e) => setData({...data, gender: e.target.value as any})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 font-bold text-slate-800 focus:ring-2 focus:ring-rose-200 outline-none">
                  <option value="female">Feminino</option>
                  <option value="male">Masculino</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-50">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Fator de Atividade (FA)</label>
              <select value={data.activityFactor} onChange={(e) => setData({...data, activityFactor: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 font-bold text-slate-800 focus:ring-2 focus:ring-rose-200 outline-none text-xs">
                {Object.entries(activityLabels).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Cintura (cm)</label>
                <input type="number" value={data.waist} onChange={(e) => setData({...data, waist: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 font-bold text-slate-800 focus:ring-2 focus:ring-rose-200 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Quadril (cm)</label>
                <input type="number" value={data.hip} onChange={(e) => setData({...data, hip: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 font-bold text-slate-800 focus:ring-2 focus:ring-rose-200 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Results Content */}
        <div className="lg:col-span-8">
          {activeTab === 'energy' && (
            <div className="space-y-6 animate-scale-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-rose-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 text-rose-50"><Zap size={80} /></div>
                  <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1 relative">Mifflin-St Jeor (TMB)</h4>
                  <p className="text-4xl font-black text-rose-500 relative">{Math.round(calculations.tmbMifflin)} <span className="text-lg">kcal</span></p>
                  <p className="text-xs text-slate-400 mt-4 relative">Fórmula padrão recomendada pela Academy of Nutrition and Dietetics.</p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 text-white/5"><Activity size={80} /></div>
                  <h4 className="text-rose-300 text-xs font-black uppercase tracking-widest mb-1 relative">Gasto Energético Total (GET)</h4>
                  <p className="text-4xl font-black text-white relative">{Math.round(calculations.get)} <span className="text-lg">kcal/dia</span></p>
                  <div className="mt-4 flex items-center gap-2 relative">
                    <span className="bg-rose-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Fator {data.activityFactor}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Meta Hídrica</h5>
                  <div className="flex items-center justify-center gap-2 text-blue-500 mb-1">
                    <Droplets size={20} />
                    <span className="text-2xl font-black">{Math.round(calculations.water / 100) / 10}L</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Baseado em 35ml por kg/peso</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Harris-Benedict</h5>
                  <div className="text-2xl font-black text-slate-700 mb-1">{Math.round(calculations.tmbHarris)}</div>
                  <p className="text-[10px] text-slate-400">Método clássico alternativo</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Fibras Recomendadas</h5>
                  <div className="text-2xl font-black text-teal-600 mb-1">{Math.round(macros.fiber)}g</div>
                  <p className="text-[10px] text-slate-400">Baseado no GET diário</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'composition' && (
            <div className="space-y-6 animate-scale-up">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">Índice de Massa Corporal</h3>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-4xl font-black text-rose-500">{calculations.imc.toFixed(1)}</span>
                       <div className="h-10 w-px bg-slate-200 mx-2"></div>
                       <div>
                         <p className={`font-black text-sm uppercase tracking-widest ${imcClassification(calculations.imc).color}`}>
                           {imcClassification(calculations.imc).label}
                         </p>
                       </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-3xl text-center min-w-[120px]">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Peso Ideal</p>
                    <p className="text-xl font-bold text-slate-700">
                      {Math.round(18.5 * Math.pow(data.height/100, 2))} - {Math.round(24.9 * Math.pow(data.height/100, 2))} kg
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-50">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <Heart size={18} className="text-rose-400" /> Relação Cintura-Quadril
                      </h4>
                      <span className="text-2xl font-black text-rose-500">{calculations.icq.toFixed(2)}</span>
                    </div>
                    <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${calculations.icq > (data.gender === 'male' ? 0.95 : 0.85) ? 'bg-red-500 w-[90%]' : 'bg-green-500 w-[60%]'}`}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {calculations.icq > (data.gender === 'male' ? 0.95 : 0.85) 
                        ? '⚠️ Risco cardiovascular aumentado para este padrão de gordura.' 
                        : '✅ Padrão de distribuição dentro dos limites de normalidade.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <Ruler size={18} className="text-rose-400" /> Relação Cintura-Estatura
                      </h4>
                      <span className="text-2xl font-black text-rose-500">{calculations.rcest.toFixed(2)}</span>
                    </div>
                    <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${calculations.rcest > 0.5 ? 'bg-orange-500 w-[85%]' : 'bg-green-500 w-[50%]'}`}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {calculations.rcest > 0.5 
                        ? '⚠️ A circunferência da cintura excede 50% da estatura.' 
                        : '✅ Relação saudável (Abaixo de 0.50).'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'macros' && (
            <div className="space-y-6 animate-scale-up">
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
                  <div className="space-y-4 flex-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Proteína (g/kg)</label>
                    <input 
                      type="range" min="0.8" max="3.5" step="0.1" 
                      value={data.proteinPerKg} 
                      onChange={(e) => setData({...data, proteinPerKg: Number(e.target.value)})}
                      className="w-full accent-rose-400 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                      <span>Sedentário: 0.8</span>
                      <span className="text-rose-500 text-lg">{data.proteinPerKg} g/kg</span>
                      <span>Atleta: 3.0+</span>
                    </div>
                  </div>
                  <div className="space-y-4 flex-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Gordura (%)</label>
                    <input 
                      type="range" min="15" max="45" step="1" 
                      value={data.fatPercent} 
                      onChange={(e) => setData({...data, fatPercent: Number(e.target.value)})}
                      className="w-full accent-rose-400 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                      <span>Mín: 15%</span>
                      <span className="text-rose-500 text-lg">{data.fatPercent} %</span>
                      <span>Máx: 45%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Protein Card */}
                  <div className="bg-[#FFF4F4] p-6 rounded-3xl text-center group hover:shadow-lg transition-all border border-rose-50">
                    <h5 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] mb-4">Proteína</h5>
                    <div className="text-3xl font-black text-rose-900 mb-1">{Math.round(macros.prot.g)}g</div>
                    <div className="text-[10px] font-bold text-rose-400 uppercase">{Math.round(macros.prot.kcal)} kcal • {Math.round(macros.prot.pct)}%</div>
                  </div>
                  {/* Carbs Card */}
                  <div className="bg-[#F4F9FF] p-6 rounded-3xl text-center group hover:shadow-lg transition-all border border-blue-50">
                    <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Carboidratos</h5>
                    <div className="text-3xl font-black text-blue-900 mb-1">{Math.round(macros.carb.g)}g</div>
                    <div className="text-[10px] font-bold text-blue-400 uppercase">{Math.round(macros.carb.kcal)} kcal • {Math.round(macros.carb.pct)}%</div>
                  </div>
                  {/* Fats Card */}
                  <div className="bg-[#FFFDF4] p-6 rounded-3xl text-center group hover:shadow-lg transition-all border border-yellow-50">
                    <h5 className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.2em] mb-4">Gorduras</h5>
                    <div className="text-3xl font-black text-yellow-900 mb-1">{Math.round(macros.fat.g)}g</div>
                    <div className="text-[10px] font-bold text-yellow-600 uppercase">{Math.round(macros.fat.kcal)} kcal • {Math.round(macros.fat.pct)}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-rose-400 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-900/50">
                    <Utensils size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Resumo do Planejamento</h4>
                    <p className="text-xs text-rose-300 font-medium">Divisão balanceada baseada no GET de {Math.round(calculations.get)} kcal.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Fibra</p>
                    <p className="text-xl font-bold">{Math.round(macros.fiber)}g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Água</p>
                    <p className="text-xl font-bold">{Math.round(calculations.water / 100) / 10}L</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionalCalculators;
