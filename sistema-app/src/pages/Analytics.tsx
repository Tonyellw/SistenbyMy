/**
 * Página: Analytics / Ciência de Dados
 */

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { TrendingUp, TrendingDown, Minus, BarChart3, Zap, Flame, Activity, Brain } from 'lucide-react';
import { average, standardDeviation, median, trend, formatNumber, safePercent } from '@/utils/helpers';
import { MOOD_CONFIG } from '@/types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';

export const Analytics: React.FC = () => {
  const { user, progress, emotionalLogs, allMissions } = useApp();
  if (!user) return null;

  // ── Análise de Dados ────────────────────────────────────────
  const analysis = useMemo(() => {
    const xpData = progress.map(p => p.xpEarned);
    const calData = progress.map(p => p.caloriesBurned);
    const completionData = progress.map(p => safePercent(p.missionsCompleted, p.totalMissions));

    const completed = allMissions.filter(m => m.completed);
    const categories = ['corpo', 'social', 'intelectual', 'financeiro'];
    const catStats = categories.map(cat => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: completed.filter(m => m.category === cat).length,
      color: cat === 'corpo' || cat === 'financeiro' ? '#ff0040' : '#00d4ff',
    }));

    const moodData = emotionalLogs.slice(-30).map(l => ({
      date: l.date.slice(5),
      mood: MOOD_CONFIG[l.mood].value,
      energy: l.energy,
      motivation: l.motivation,
    }));

    return {
      xp: { avg: Math.round(average(xpData)), std: Math.round(standardDeviation(xpData)), med: Math.round(median(xpData)), trend: trend(xpData) },
      cal: { avg: Math.round(average(calData)), std: Math.round(standardDeviation(calData)), med: Math.round(median(calData)), trend: trend(calData) },
      completion: { avg: Math.round(average(completionData)), trend: trend(completionData) },
      catStats,
      moodData,
      totalDays: progress.length,
      activeDays: progress.filter(p => p.missionsCompleted > 0).length,
    };
  }, [progress, allMissions, emotionalLogs]);

  const TrendIcon = ({ t }: { t: 'up' | 'down' | 'stable' }) => {
    if (t === 'up') return <TrendingUp size={14} className="text-neon-blue" />;
    if (t === 'down') return <TrendingDown size={14} className="text-neon-red" />;
    return <Minus size={14} className="text-gray-500" />;
  };

  const chartData = progress.slice(-30).map((p, i) => ({
    name: `D${i + 1}`,
    xp: p.xpEarned,
    cal: p.caloriesBurned,
    rate: safePercent(p.missionsCompleted, p.totalMissions),
  }));

  // Radial data para gauge
  const gaugeData = [
    { name: 'Consistência', value: analysis.completion.avg, fill: '#ff0040' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black neon-text-blue tracking-tight flex items-center gap-3">
          <BarChart3 size={32} /> ANALYTICS
        </h1>
        <p className="text-gray-500 text-sm font-mono mt-1">CIÊNCIA DE DADOS • ANÁLISE AVANÇADA</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Zap, label: 'XP MÉDIO/DIA', value: analysis.xp.avg, sub: `σ=${analysis.xp.std}`, trend: analysis.xp.trend, color: 'red' },
          { icon: Flame, label: 'CAL MÉDIA/DIA', value: analysis.cal.avg, sub: `med=${analysis.cal.med}`, trend: analysis.cal.trend, color: 'red' },
          { icon: Activity, label: 'DIAS ATIVOS', value: `${analysis.activeDays}/${analysis.totalDays}`, sub: `${safePercent(analysis.activeDays, analysis.totalDays)}%`, trend: 'stable' as const, color: 'blue' },
          { icon: Brain, label: 'TAXA CONCLUSÃO', value: `${analysis.completion.avg}%`, sub: 'média geral', trend: analysis.completion.trend, color: 'blue' },
        ].map((kpi, i) => (
          <div key={i} className="neon-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <kpi.icon size={14} className={kpi.color === 'red' ? 'text-neon-red' : 'text-neon-blue'} />
              <TrendIcon t={kpi.trend} />
            </div>
            <div className="text-[10px] font-mono text-gray-600 uppercase">{kpi.label}</div>
            <div className={`text-xl font-black ${kpi.color === 'red' ? 'neon-text-red' : 'neon-text-blue'}`}>{kpi.value}</div>
            <div className="text-[10px] font-mono text-gray-600">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Gauge de Consistência */}
      <div className="neon-card rounded-xl p-5">
        <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">📊 ÍNDICE DE CONSISTÊNCIA</h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width={200} height={200}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={gaugeData} startAngle={180} endAngle={0}>
              <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#1a1a1a' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="text-center -ml-16">
            <div className="text-4xl font-black neon-text-red">{analysis.completion.avg}%</div>
            <div className="text-[10px] font-mono text-gray-600">CONSISTÊNCIA</div>
          </div>
        </div>
      </div>

      {/* Gráfico XP ao longo do tempo */}
      {chartData.length > 2 && (
        <div className="neon-card rounded-xl p-5">
          <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">📈 EVOLUÇÃO XP (30 DIAS)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="xpGradA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff0040" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#ff0040" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#444' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="xp" stroke="#ff0040" fill="url(#xpGradA)" strokeWidth={2} name="XP" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Taxa de Conclusão ao longo do tempo */}
      {chartData.length > 2 && (
        <div className="neon-card rounded-xl p-5">
          <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">📊 TAXA DE CONCLUSÃO (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#444' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="rate" stroke="#00d4ff" fill="url(#rateGrad)" strokeWidth={2} name="%" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Distribuição por Categoria */}
      {analysis.catStats.some(c => c.value > 0) && (
        <div className="neon-card rounded-xl p-5">
          <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">🎯 DISTRIBUIÇÃO POR CATEGORIA</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={analysis.catStats.filter(c => c.value > 0)} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {analysis.catStats.filter(c => c.value > 0).map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-3">
            {analysis.catStats.filter(c => c.value > 0).map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-gray-500">{c.name}: {c.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Humor */}
      {analysis.moodData.length > 0 && (
        <div className="neon-card rounded-xl p-5">
          <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">🧠 HUMOR & ENERGIA</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={analysis.moodData}>
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#444' }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 10]} />
              <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="energy" stroke="#00d4ff" fill="none" strokeWidth={2} name="Energia" />
              <Area type="monotone" dataKey="motivation" stroke="#ff0040" fill="none" strokeWidth={2} strokeDasharray="5 5" name="Motivação" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Estatísticas descritivas */}
      <div className="neon-card rounded-xl p-5">
        <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">📐 ESTATÍSTICAS DESCRITIVAS</h3>
        <div className="space-y-3">
          {[
            { label: 'XP Total Acumulado', value: formatNumber(user.totalXP) },
            { label: 'Calorias Queimadas Total', value: formatNumber(user.totalCaloriesBurned) },
            { label: 'Missões Concluídas', value: formatNumber(user.completedMissionsCount) },
            { label: 'Streak Atual', value: `${user.currentStreak} dias` },
            { label: 'Maior Streak', value: `${user.longestStreak} dias` },
            { label: 'Desvio Padrão XP', value: formatNumber(analysis.xp.std) },
            { label: 'Mediana XP', value: formatNumber(analysis.xp.med) },
          ].map((stat, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-neon-black-border last:border-0">
              <span className="text-xs font-mono text-gray-500">{stat.label}</span>
              <span className="text-sm font-bold text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
