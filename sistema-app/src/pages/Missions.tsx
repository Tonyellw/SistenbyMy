/**
 * Página: Missões Paralelas + Diárias
 */

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, CheckCircle2, Circle, Trash2, Zap, Layers, X } from 'lucide-react';
import { MissionCategory, MISSION_CATEGORIES } from '@/types';

export const Missions: React.FC = () => {
  const { parallelMissions, addParallelMission, completeParallelMission, removeParallelMission } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<MissionCategory | 'all'>('all');
  const [form, setForm] = useState({ title: '', desc: '', category: 'corpo' as MissionCategory, xp: 10 });

  const filtered = filter === 'all' ? parallelMissions : parallelMissions.filter(m => m.category === filter);
  const sorted = [...filtered].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

  const handleCreate = () => {
    if (!form.title.trim()) return;
    addParallelMission(form.title, form.category, form.desc || undefined, form.xp);
    setForm({ title: '', desc: '', category: 'corpo', xp: 10 });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black neon-text-blue tracking-tight flex items-center gap-3">
            <Layers size={32} /> MISSÕES
          </h1>
          <p className="text-gray-500 text-sm font-mono mt-1">
            {parallelMissions.filter(m => m.completed).length}/{parallelMissions.length} CONCLUÍDAS
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="neon-btn-red text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> NOVA
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${filter === 'all' ? 'neon-btn-red text-white' : 'neon-card text-gray-500'}`}
        >
          TODAS ({parallelMissions.length})
        </button>
        {(Object.keys(MISSION_CATEGORIES) as MissionCategory[]).map(cat => {
          const info = MISSION_CATEGORIES[cat];
          const count = parallelMissions.filter(m => m.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1 ${filter === cat ? 'neon-btn-blue text-neon-black' : 'neon-card text-gray-500'}`}
            >
              {info.icon} {info.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Lista */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 neon-card rounded-xl">
          <Layers size={48} className="mx-auto text-gray-700 mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">Nenhuma missão ainda</h3>
          <p className="text-sm text-gray-600 mb-6">Crie missões paralelas para evoluir em múltiplas áreas.</p>
          <button onClick={() => setShowModal(true)} className="neon-btn-red text-white px-6 py-3 rounded-xl font-bold">
            CRIAR PRIMEIRA MISSÃO
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(mission => {
            const catInfo = MISSION_CATEGORIES[mission.category];
            return (
              <div key={mission.id} className={`neon-card rounded-xl p-4 ${mission.completed ? 'opacity-50' : ''}`}>
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => !mission.completed && completeParallelMission(mission.id)}
                    disabled={mission.completed}
                    className="flex-shrink-0 mt-0.5"
                  >
                    {mission.completed
                      ? <CheckCircle2 size={24} className="text-neon-blue" />
                      : <Circle size={24} className="text-gray-600 hover:text-neon-red transition-colors" />
                    }
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                        style={{ color: catInfo.color, border: `1px solid ${catInfo.color}44` }}
                      >
                        {catInfo.icon} {catInfo.name}
                      </span>
                    </div>
                    <h3 className={`font-bold ${mission.completed ? 'line-through text-gray-600' : 'text-white'}`}>
                      {mission.title}
                    </h3>
                    {mission.description && <p className="text-xs text-gray-600 mt-1">{mission.description}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-mono neon-text-red flex items-center gap-1"><Zap size={10} /> {mission.xp} XP</span>
                    </div>
                  </div>
                  <button onClick={() => removeParallelMission(mission.id)} className="text-gray-700 hover:text-neon-red transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Criar */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative neon-card neon-border-red border rounded-2xl p-6 w-full max-w-lg animate-slide-up" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-neon-red"><X size={20} /></button>
            <h2 className="text-xl font-black neon-text-red mb-6">NOVA MISSÃO PARALELA</h2>

            <div className="space-y-4">
              {/* Categoria */}
              <div>
                <label className="text-xs font-mono text-gray-500 mb-2 block">CATEGORIA</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(MISSION_CATEGORIES) as MissionCategory[]).map(cat => {
                    const info = MISSION_CATEGORIES[cat];
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, category: cat }))}
                        className={`p-3 rounded-lg border text-left transition-all ${form.category === cat ? 'border-neon-red shadow-neon-red bg-neon-red/5' : 'border-neon-black-border'}`}
                      >
                        <div className="text-lg mb-1">{info.icon}</div>
                        <div className="text-xs font-bold">{info.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 mb-2 block">TÍTULO</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Ex: Treinar por 30 minutos"
                  className="w-full bg-neon-black-elevated border border-neon-black-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-red"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 mb-2 block">DESCRIÇÃO (OPCIONAL)</label>
                <textarea
                  value={form.desc}
                  onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                  placeholder="Detalhes..."
                  rows={2}
                  className="w-full bg-neon-black-elevated border border-neon-black-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-red resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 mb-2 block">RECOMPENSA XP: <span className="neon-text-red">{form.xp}</span></label>
                <input
                  type="range" min="5" max="50" step="5"
                  value={form.xp}
                  onChange={e => setForm(f => ({ ...f, xp: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-neon-black-border text-gray-500 font-bold">
                  CANCELAR
                </button>
                <button onClick={handleCreate} disabled={!form.title.trim()} className="flex-1 py-3 rounded-xl neon-btn-red text-white font-bold disabled:opacity-30">
                  CRIAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
