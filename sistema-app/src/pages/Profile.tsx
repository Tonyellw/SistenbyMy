/**
 * Página: Perfil + Log Emocional + Reset
 */

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { User, Settings, Trash2, Award, Heart, Zap } from 'lucide-react';
import { formatDate, formatNumber } from '@/utils/helpers';
import { MoodType, MOOD_CONFIG } from '@/types';

export const Profile: React.FC = () => {
  const { user, emotionalLogs, logEmotion, resetApp } = useApp();
  const [showReset, setShowReset] = useState(false);
  const [showMoodLog, setShowMoodLog] = useState(false);
  const [mood, setMood] = useState<MoodType>('neutro');
  const [energy, setEnergy] = useState(5);
  const [motivation, setMotivation] = useState(5);
  const [note, setNote] = useState('');

  if (!user) return null;

  const handleLogMood = () => {
    logEmotion(mood, energy, motivation, note || undefined);
    setShowMoodLog(false);
    setNote('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl lg:text-4xl font-black neon-text-red tracking-tight flex items-center gap-3">
        <User size={32} /> PERFIL
      </h1>

      {/* Identidade Card */}
      <div className="neon-card neon-border-red border rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black neon-btn-red text-white shadow-neon-red-lg">
            {user.level}
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase neon-text-red">{user.identity.customName || user.identity.type}</h2>
            <p className="text-xs font-mono text-gray-500">NÍVEL {user.level} • {formatNumber(user.totalXP)} XP TOTAL</p>
          </div>
        </div>
        <p className="text-sm text-gray-500">{user.identity.description}</p>
      </div>

      {/* Log Emocional */}
      <div className="neon-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Heart size={14} className="text-neon-red" /> REGISTRO EMOCIONAL
          </h3>
          <button onClick={() => setShowMoodLog(!showMoodLog)} className="text-xs font-mono neon-text-blue">
            {showMoodLog ? 'FECHAR' : '+ REGISTRAR'}
          </button>
        </div>

        {showMoodLog && (
          <div className="space-y-4 animate-slide-up">
            <div>
              <label className="text-xs font-mono text-gray-600 block mb-2">COMO VOCÊ ESTÁ?</label>
              <div className="flex gap-2">
                {(Object.keys(MOOD_CONFIG) as MoodType[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`flex-1 p-3 rounded-lg text-center transition-all ${mood === m ? 'neon-border-red border-2 bg-neon-red/5' : 'border border-neon-black-border'}`}
                  >
                    <div className="text-2xl mb-1">{MOOD_CONFIG[m].emoji}</div>
                    <div className="text-[9px] font-mono text-gray-500">{MOOD_CONFIG[m].label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-gray-600 mb-2 flex justify-between">
                <span>ENERGIA</span><span className="neon-text-blue">{energy}/10</span>
              </label>
              <input type="range" min="1" max="10" value={energy} onChange={e => setEnergy(parseInt(e.target.value))} className="w-full" />
            </div>

            <div>
              <label className="text-xs font-mono text-gray-600 mb-2 flex justify-between">
                <span>MOTIVAÇÃO</span><span className="neon-text-red">{motivation}/10</span>
              </label>
              <input type="range" min="1" max="10" value={motivation} onChange={e => setMotivation(parseInt(e.target.value))} className="w-full" />
            </div>

            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Nota opcional..."
              rows={2}
              className="w-full bg-neon-black-elevated border border-neon-black-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-red resize-none text-sm"
            />

            <button onClick={handleLogMood} className="w-full py-3 rounded-xl neon-btn-blue text-neon-black font-bold">
              SALVAR REGISTRO
            </button>
          </div>
        )}

        {/* Últimos logs */}
        {emotionalLogs.length > 0 && !showMoodLog && (
          <div className="space-y-2">
            {emotionalLogs.slice(-5).reverse().map(log => (
              <div key={log.id} className="flex items-center gap-3 py-2 border-b border-neon-black-border last:border-0">
                <span className="text-xl">{MOOD_CONFIG[log.mood].emoji}</span>
                <div className="flex-1">
                  <div className="text-xs text-gray-400">{log.date}</div>
                  {log.note && <div className="text-xs text-gray-600">{log.note}</div>}
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-gray-600">E:{log.energy} M:{log.motivation}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="neon-card rounded-xl p-5">
        <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Award size={14} className="text-neon-blue" /> ESTATÍSTICAS
        </h3>
        <div className="space-y-3">
          {[
            ['XP Total', formatNumber(user.totalXP)],
            ['Nível', String(user.level)],
            ['Missões Concluídas', formatNumber(user.completedMissionsCount)],
            ['Calorias Queimadas', formatNumber(user.totalCaloriesBurned)],
            ['Streak Atual', `${user.currentStreak} dias`],
            ['Maior Streak', `${user.longestStreak} dias`],
            ['Conta Criada', formatDate(user.createdAt)],
            ['Última Atividade', formatDate(user.lastActive)],
          ].map(([label, value], i) => (
            <div key={i} className="flex justify-between items-center py-1">
              <span className="text-xs text-gray-500">{label}</span>
              <span className="text-sm font-bold text-white font-mono">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="neon-card rounded-xl p-5 border border-red-900/30">
        <h3 className="text-xs font-mono text-neon-red uppercase tracking-widest mb-3 flex items-center gap-2">
          <Trash2 size={14} /> ZONA DE PERIGO
        </h3>
        <p className="text-xs text-gray-600 mb-4">Apaga permanentemente todos os dados. Ação irreversível.</p>
        <button onClick={() => setShowReset(true)} className="px-4 py-2 rounded-xl border border-neon-red/40 text-neon-red text-sm font-bold hover:bg-neon-red/10 transition-all">
          RESETAR APLICATIVO
        </button>
      </div>

      {/* Modal Reset */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowReset(false)} />
          <div className="relative neon-card border border-red-900/50 rounded-2xl p-6 w-full max-w-sm animate-slide-up">
            <h2 className="text-xl font-black neon-text-red mb-4">CONFIRMAR RESET</h2>
            <p className="text-sm text-gray-500 mb-6">Todos os dados serão permanentemente apagados.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowReset(false)} className="flex-1 py-3 rounded-xl border border-neon-black-border text-gray-500 font-bold">CANCELAR</button>
              <button onClick={resetApp} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold shadow-neon-red">RESETAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
