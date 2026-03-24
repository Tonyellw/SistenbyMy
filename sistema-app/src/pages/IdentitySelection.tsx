import React, { useState } from 'react';
import { PREDEFINED_IDENTITIES, IdentityType, Identity } from '@/types';
import { Zap } from 'lucide-react';

interface Props { onSelect: (identity: Identity) => void; }

export const IdentitySelection: React.FC<Props> = ({ onSelect }) => {
  const [selected, setSelected] = useState<IdentityType | null>(null);
  const [custom, setCustom] = useState('');

  const handleConfirm = () => {
    if (!selected) return;
    const base = PREDEFINED_IDENTITIES[selected];
    onSelect({ ...base, customName: selected === 'personalizada' ? custom : undefined, createdAt: new Date().toISOString() });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 grid-bg">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-neon-red mb-6 shadow-neon-red-lg">
            <Zap className="text-neon-red" size={40} />
          </div>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight neon-text-red">SISTEMA</h1>
          <p className="text-lg neon-text-blue mt-2 font-mono">IDENTIDADE EM CONSTRUÇÃO</p>
        </div>

        <p className="text-center text-gray-500 mb-8 max-w-md mx-auto">
          Escolha quem você quer se tornar. Todas as suas ações serão validadas contra essa identidade.
        </p>

        {/* Grid de Identidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {(Object.keys(PREDEFINED_IDENTITIES) as IdentityType[]).map((type) => {
            const identity = PREDEFINED_IDENTITIES[type];
            const isSelected = selected === type;
            const isRed = identity.color === '#ff0040';

            return (
              <button
                key={type}
                onClick={() => setSelected(type)}
                className={`
                  neon-card rounded-xl p-5 text-left transition-all
                  ${isSelected ? (isRed ? 'neon-border-red border-2' : 'neon-border-blue border-2') : 'border border-neon-black-border'}
                `}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${isRed ? 'bg-neon-red shadow-neon-red' : 'bg-neon-blue shadow-neon-blue'}`} />
                  <h3 className={`font-bold text-lg uppercase tracking-wider ${isRed ? 'neon-text-red' : 'neon-text-blue'}`}>
                    {type === 'personalizada' ? 'Personalizada' : type}
                  </h3>
                </div>
                <p className="text-sm text-gray-500">{identity.description}</p>
              </button>
            );
          })}
        </div>

        {/* Input Personalizado */}
        {selected === 'personalizada' && (
          <div className="mb-6 animate-slide-up">
            <input
              type="text"
              placeholder="Defina sua identidade..."
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              className="w-full bg-neon-black-card border border-neon-black-border rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-red focus:shadow-neon-red"
              autoFocus
            />
          </div>
        )}

        {/* Botão Confirmar */}
        <button
          onClick={handleConfirm}
          disabled={!selected || (selected === 'personalizada' && !custom.trim())}
          className="w-full py-4 rounded-xl font-bold text-lg uppercase tracking-widest neon-btn-red text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ⚡ INICIAR JORNADA
        </button>

        <p className="text-center text-gray-600 text-xs mt-6 font-mono">
          365 DIAS • DADOS LOCAIS • OFFLINE FIRST
        </p>
      </div>
    </div>
  );
};
