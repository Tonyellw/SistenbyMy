import React from 'react';
import { useApp } from '@/context/AppContext';
import { Zap, Flame, Target, TrendingUp, Trophy, Clock, Activity } from 'lucide-react';
import { getGreeting, formatNumber, safePercent, getDifficultyLabel, getDifficultyColor } from '@/utils/helpers';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const Dashboard: React.FC = () => {
  const { user, todayMission, progress, currentStreak, completeTodayMission } = useApp();
  if (!user) return null;

  const xpPercent = safePercent(user.currentXP, user.xpToNextLevel);
  const last14 = progress.slice(-14).map((p, i) => ({
    name: `D${i + 1}`,
    xp: p.xpEarned,
    cal: p.caloriesBurned,
    done: p.missionsCompleted,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-mono">{getGreeting()}</p>
          <h1 className="text-3xl lg:text-4xl font-black uppercase neon-text-red tracking-tight">
            {user.identity.customName || user.identity.type}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{user.identity.description}</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-gray-600">NÍVEL</div>
          <div className="text-4xl font-black neon-text-blue">{user.level}</div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="neon-card rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono text-gray-500 flex items-center gap-1">
            <Zap size={12} className="text-neon-red" /> PROGRESSO NÍVEL {user.level + 1}
          </span>
          <span className="text-xs font-mono neon-text-red">{user.currentXP} / {user.xpToNextLevel} XP</span>
        </div>
        <div className="h-3 bg-neon-black-elevated rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${xpPercent}%`,
              background: 'linear-gradient(90deg, #ff0040, #00d4ff)',
              boxShadow: '0 0 15px #ff004066',
            }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Zap, label: 'XP TOTAL', value: formatNumber(user.totalXP), color: 'red' },
          { icon: Flame, label: 'STREAK', value: `${currentStreak} dias`, color: 'red' },
          { icon: Target, label: 'CONCLUÍDAS', value: formatNumber(user.completedMissionsCount), color: 'blue' },
          { icon: Activity, label: 'CALORIAS', value: formatNumber(user.totalCaloriesBurned), color: 'blue' },
        ].map((stat, i) => (
          <div key={i} className="neon-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={14} className={stat.color === 'red' ? 'text-neon-red' : 'text-neon-blue'} />
              <span className="text-[10px] font-mono text-gray-600 uppercase">{stat.label}</span>
            </div>
            <div className={`text-xl lg:text-2xl font-black ${stat.color === 'red' ? 'neon-text-red' : 'neon-text-blue'}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Missão de Hoje */}
      {todayMission && (
        <div className={`neon-card rounded-xl p-5 ${todayMission.completed ? 'neon-border-blue' : 'neon-border-red'} border`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono neon-text-red uppercase tracking-widest">⚡ MISSÃO DE HOJE</span>
            <span
              className="text-[10px] font-mono font-bold px-2 py-1 rounded"
              style={{ color: getDifficultyColor(todayMission.difficulty), border: `1px solid ${getDifficultyColor(todayMission.difficulty)}44` }}
            >
              {getDifficultyLabel(todayMission.difficulty)}
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-black text-white mb-2">{todayMission.title}</h2>
          <p className="text-sm text-gray-500 mb-4 whitespace-pre-line">{todayMission.description}</p>

          <div className="flex items-center gap-4 mb-4 text-xs font-mono">
            <span className="neon-text-red flex items-center gap-1"><Zap size={12} /> {todayMission.xp} XP</span>
            {todayMission.caloriesBurned ? <span className="neon-text-blue flex items-center gap-1"><Flame size={12} /> {todayMission.caloriesBurned} cal</span> : null}
          </div>

          {!todayMission.completed ? (
            <button
              onClick={() => completeTodayMission()}
              className="w-full py-3 rounded-xl font-bold uppercase tracking-widest neon-btn-red text-white"
            >
              ✅ COMPLETAR MISSÃO
            </button>
          ) : (
            <div className="text-center py-3 rounded-xl bg-neon-black-elevated border border-neon-blue/30 neon-text-blue font-bold uppercase tracking-widest">
              ✓ MISSÃO CONCLUÍDA
            </div>
          )}
        </div>
      )}

      {/* Gráfico de Progresso */}
      {last14.length > 1 && (
        <div className="neon-card rounded-xl p-5">
          <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">📊 XP DOS ÚLTIMOS 14 DIAS</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={last14}>
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff0040" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#ff0040" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#444' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#ff0040' }}
              />
              <Area type="monotone" dataKey="xp" stroke="#ff0040" fill="url(#xpGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de Calorias */}
      {last14.length > 1 && (
        <div className="neon-card rounded-xl p-5">
          <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">🔥 CALORIAS QUEIMADAS</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={last14}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#444' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="cal" fill="#00d4ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
