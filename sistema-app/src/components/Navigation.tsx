/**
 * Navegação - Bottom Nav (mobile) + Sidebar (desktop)
 */

import React from 'react';
import { Home, CalendarDays, Layers, BarChart3, User } from 'lucide-react';

export type Page = 'dashboard' | 'calendar' | 'missions' | 'analytics' | 'profile';

interface Props {
  current: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { id: Page; icon: typeof Home; label: string }[] = [
  { id: 'dashboard', icon: Home, label: 'Início' },
  { id: 'calendar', icon: CalendarDays, label: '365 Dias' },
  { id: 'missions', icon: Layers, label: 'Missões' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'profile', icon: User, label: 'Perfil' },
];

export const Navigation: React.FC<Props> = ({ current, onNavigate }) => {
  return (
    <>
      {/* ── Desktop Sidebar ──────────────────────────────── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-20 flex-col items-center py-8 bg-neon-black-card border-r border-neon-black-border z-50">
        {/* Logo */}
        <div className="mb-10">
          <div className="w-10 h-10 rounded-lg bg-neon-red flex items-center justify-center text-white font-black text-lg shadow-neon-red">
            S
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = current === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all
                  ${isActive
                    ? 'bg-neon-red/10 text-neon-red shadow-neon-red'
                    : 'text-gray-600 hover:text-gray-400 hover:bg-neon-black-hover'
                  }
                `}
                title={item.label}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[8px] font-mono font-bold uppercase">{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-neon-black-card border-t border-neon-black-border z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-16 max-w-screen-md mx-auto px-2">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = current === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-lg transition-all
                  ${isActive ? 'text-neon-red' : 'text-gray-600'}
                `}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] font-mono ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-neon-red shadow-neon-red mt-0.5" />}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
