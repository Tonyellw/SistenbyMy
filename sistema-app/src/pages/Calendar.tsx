/**
 * ═══════════════════════════════════════════════════════════
 * CALENDÁRIO 365 DIAS - Visual Neon com Missões Dinâmicas
 * ═══════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { generateMissionForDay, dateFromDayOfYear } from '@/services/missionGenerator';
import { getDayOfYear, getMonthNameFull, getDifficultyLabel, getDifficultyColor, formatNumber } from '@/utils/helpers';
import { ChevronLeft, ChevronRight, Zap, Flame, X } from 'lucide-react';
import { MISSION_CATEGORIES } from '@/types';
import type { DailyMission } from '@/types';

export const Calendar: React.FC = () => {
  const { allMissions } = useApp();
  const today = getDayOfYear(new Date());
  const currentYear = new Date().getFullYear();
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [selectedMission, setSelectedMission] = useState<DailyMission | null>(null);

  // Gerar dados do mês
  const monthData = useMemo(() => {
    const firstDay = new Date(currentYear, viewMonth, 1);
    const daysInMonth = new Date(currentYear, viewMonth + 1, 0).getDate();
    const startWeekday = firstDay.getDay(); // 0=Dom

    const days: { day: number; dayOfYear: number; mission: DailyMission }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, viewMonth, d);
      const doy = getDayOfYear(date);
      const existing = allMissions.find(m => m.dayOfYear === doy);
      const mission = existing || generateMissionForDay(doy);
      days.push({ day: d, dayOfYear: doy, mission });
    }

    return { days, startWeekday, daysInMonth };
  }, [viewMonth, currentYear, allMissions]);

  // Estatísticas do mês
  const monthStats = useMemo(() => {
    const completed = monthData.days.filter(d => d.mission.completed).length;
    const totalXP = monthData.days.filter(d => d.mission.completed).reduce((s, d) => s + d.mission.xp, 0);
    const totalCal = monthData.days.filter(d => d.mission.completed).reduce((s, d) => s + (d.mission.caloriesBurned || 0), 0);
    return { completed, totalXP, totalCal, total: monthData.daysInMonth };
  }, [monthData]);

  const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-black neon-text-red tracking-tight">CALENDÁRIO</h1>
        <p className="text-gray-500 text-sm font-mono mt-1">365 MISSÕES • 365 DIAS • 1 IDENTIDADE</p>
      </div>

      {/* Navegação Mês */}
      <div className="flex items-center justify-between neon-card rounded-xl p-4">
        <button onClick={() => setViewMonth(v => Math.max(v - 1, 0))} className="p-2 hover:text-neon-red transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-black uppercase neon-text-blue">{getMonthNameFull(viewMonth)}</h2>
          <p className="text-xs font-mono text-gray-600">{currentYear}</p>
        </div>
        <button onClick={() => setViewMonth(v => Math.min(v + 1, 11))} className="p-2 hover:text-neon-red transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Stats do Mês */}
      <div className="grid grid-cols-3 gap-3">
        <div className="neon-card rounded-xl p-3 text-center">
          <div className="text-[10px] font-mono text-gray-600">CONCLUÍDAS</div>
          <div className="text-xl font-black neon-text-red">{monthStats.completed}/{monthStats.total}</div>
        </div>
        <div className="neon-card rounded-xl p-3 text-center">
          <div className="text-[10px] font-mono text-gray-600">XP GANHO</div>
          <div className="text-xl font-black neon-text-blue">{formatNumber(monthStats.totalXP)}</div>
        </div>
        <div className="neon-card rounded-xl p-3 text-center">
          <div className="text-[10px] font-mono text-gray-600">CALORIAS</div>
          <div className="text-xl font-black neon-text-red">{formatNumber(monthStats.totalCal)}</div>
        </div>
      </div>

      {/* Grid do Calendário */}
      <div className="neon-card rounded-xl p-4">
        {/* Cabeçalho dos dias */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(d => (
            <div key={d} className="text-center text-[10px] font-mono text-gray-600 py-1">{d}</div>
          ))}
        </div>

        {/* Dias */}
        <div className="grid grid-cols-7 gap-1">
          {/* Espaços vazios antes do primeiro dia */}
          {Array.from({ length: monthData.startWeekday }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Dias do mês */}
          {monthData.days.map(({ day, dayOfYear, mission }) => {
            const isToday = dayOfYear === today;
            const isCompleted = mission.completed;
            const isPast = dayOfYear < today;
            const isFuture = dayOfYear > today;
            const catColor = MISSION_CATEGORIES[mission.category]?.color || '#ff0040';

            return (
              <button
                key={day}
                onClick={() => setSelectedMission(mission)}
                className={`
                  aspect-square rounded-lg flex flex-col items-center justify-center relative
                  text-xs font-bold transition-all duration-200
                  ${isToday ? 'ring-2 ring-neon-red shadow-neon-red' : ''}
                  ${isCompleted ? 'bg-neon-red/10 border border-neon-red/30' : ''}
                  ${isPast && !isCompleted ? 'bg-neon-black-elevated opacity-40' : ''}
                  ${isFuture ? 'bg-neon-black-elevated hover:bg-neon-black-hover' : ''}
                  ${!isCompleted && !isPast ? 'hover:border-neon-blue/40 border border-transparent' : ''}
                `}
              >
                <span className={`${isToday ? 'neon-text-red' : isCompleted ? 'text-neon-red' : 'text-gray-500'}`}>
                  {day}
                </span>
                {isCompleted && (
                  <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-neon-red shadow-neon-red" />
                )}
                {isToday && !isCompleted && (
                  <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-neon-blue shadow-neon-blue animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neon-black-border">
          <div className="flex items-center gap-1 text-[10px] font-mono text-gray-600">
            <div className="w-2 h-2 rounded-full bg-neon-red shadow-neon-red" /> Concluída
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-gray-600">
            <div className="w-2 h-2 rounded-full bg-neon-blue shadow-neon-blue animate-pulse" /> Hoje
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-gray-600">
            <div className="w-2 h-2 rounded-full bg-gray-700" /> Pendente
          </div>
        </div>
      </div>

      {/* Modal Missão Selecionada */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedMission(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative neon-card neon-border-red border rounded-2xl p-6 w-full max-w-lg animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelectedMission(null)} className="absolute top-4 right-4 text-gray-500 hover:text-neon-red">
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono neon-text-red tracking-widest">DIA {selectedMission.dayOfYear}</span>
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                style={{ color: getDifficultyColor(selectedMission.difficulty), border: `1px solid ${getDifficultyColor(selectedMission.difficulty)}44` }}
              >
                {getDifficultyLabel(selectedMission.difficulty)}
              </span>
            </div>

            <h2 className="text-2xl font-black text-white mb-2">{selectedMission.title}</h2>
            <p className="text-sm text-gray-400 mb-4 whitespace-pre-line">{selectedMission.description}</p>

            <div className="flex flex-wrap gap-3 text-xs font-mono">
              <span className="neon-text-red flex items-center gap-1"><Zap size={12} /> {selectedMission.xp} XP</span>
              <span className={`px-2 py-0.5 rounded border ${MISSION_CATEGORIES[selectedMission.category]?.color === '#ff0040' ? 'border-neon-red/40 text-neon-red' : 'border-neon-blue/40 text-neon-blue'}`}>
                {MISSION_CATEGORIES[selectedMission.category]?.icon} {MISSION_CATEGORIES[selectedMission.category]?.name}
              </span>
              {selectedMission.caloriesBurned ? (
                <span className="neon-text-blue flex items-center gap-1"><Flame size={12} /> {selectedMission.caloriesBurned} cal</span>
              ) : null}
            </div>

            {selectedMission.completed && (
              <div className="mt-4 p-3 rounded-lg bg-neon-red/5 border border-neon-red/30 text-center">
                <span className="neon-text-red font-bold text-sm">✓ MISSÃO CONCLUÍDA</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
