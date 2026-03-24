/**
 * ═══════════════════════════════════════════════════════════
 * SISTEMA - Tipos e Interfaces Globais
 * Ciência de Dados + Banco de Dados + 365 Missões
 * ═══════════════════════════════════════════════════════════
 */

// ── Identidade ──────────────────────────────────────────────
export type IdentityType =
  | 'disciplinado'
  | 'estrategico'
  | 'inabalavel'
  | 'social'
  | 'personalizada';

export interface Identity {
  type: IdentityType;
  customName?: string;
  description: string;
  color: string;
  createdAt: string;
}

// ── Missões ─────────────────────────────────────────────────
export type MissionCategory = 'corpo' | 'social' | 'intelectual' | 'financeiro';
export type MissionDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';
export type ExerciseType =
  | 'flexao' | 'abdominal' | 'agachamento' | 'prancha' | 'burpee'
  | 'corrida' | 'caminhada' | 'pular_corda' | 'polichinelo'
  | 'lunges' | 'mountain_climber' | 'elevacao_pernas' | 'tríceps_banco'
  | 'stiff' | 'panturrilha' | 'remada' | 'superman' | 'bike'
  | 'natacao' | 'escalada' | 'yoga' | 'alongamento'
  | 'leitura' | 'meditacao' | 'journaling' | 'estudo'
  | 'networking' | 'voluntariado' | 'investimento' | 'economia';

export interface DailyMission {
  id: string;
  dayOfYear: number;       // 1 a 365
  title: string;
  description: string;
  exerciseType: ExerciseType;
  category: MissionCategory;
  quantity: number;
  unit: string;             // 'reps', 'km', 'min', 'páginas', 'R$'
  xp: number;
  difficulty: MissionDifficulty;
  completed: boolean;
  completedAt?: string;
  completedQuantity?: number;
  timeSpent?: number;       // em minutos
  caloriesBurned?: number;
}

export interface ParallelMission {
  id: string;
  title: string;
  description?: string;
  category: MissionCategory;
  xp: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  coherent: boolean;
  recurring: boolean;
}

// ── Registro Emocional ──────────────────────────────────────
export type MoodType = 'excelente' | 'bom' | 'neutro' | 'ruim' | 'pessimo';

export interface EmotionalLog {
  id: string;
  date: string;
  mood: MoodType;
  energy: number;       // 1-10
  motivation: number;   // 1-10
  note?: string;
}

// ── Progresso / Analytics ───────────────────────────────────
export interface DailyProgress {
  date: string;
  dayOfYear: number;
  missionsCompleted: number;
  totalMissions: number;
  xpEarned: number;
  caloriesBurned: number;
  timeSpent: number;
  mood?: MoodType;
  energy?: number;
  motivation?: number;
  streakCount: number;
}

export interface WeeklyStats {
  weekNumber: number;
  totalXP: number;
  totalCalories: number;
  totalTime: number;
  avgMood: number;
  avgEnergy: number;
  avgMotivation: number;
  completionRate: number;
  missionsCompleted: number;
  totalMissions: number;
}

export interface MonthlyStats {
  month: number;
  year: number;
  totalXP: number;
  totalCalories: number;
  totalTime: number;
  avgMood: number;
  completionRate: number;
  bestDay: string;
  worstDay: string;
  longestStreak: number;
}

// ── Usuário ─────────────────────────────────────────────────
export interface User {
  id: string;
  identity: Identity;
  level: number;
  totalXP: number;
  currentXP: number;
  xpToNextLevel: number;
  completedMissionsCount: number;
  consistencyRate: number;
  currentStreak: number;
  longestStreak: number;
  totalCaloriesBurned: number;
  totalTimeSpent: number;
  createdAt: string;
  lastActive: string;
}

// ── Constantes de Configuração ──────────────────────────────
export const XP_CONFIG = {
  LEVEL_BASE_XP: 100,
  LEVEL_MULTIPLIER: 1.35,
  STREAK_BONUS_PERCENT: 10,
  DIFFICULTY_MULTIPLIER: {
    easy: 1,
    medium: 1.5,
    hard: 2,
    extreme: 3,
  },
};

export const PREDEFINED_IDENTITIES: Record<IdentityType, Omit<Identity, 'createdAt'>> = {
  disciplinado: {
    type: 'disciplinado',
    description: 'Foco em rotina, organização e execução consistente. Cada dia é uma vitória.',
    color: '#ff0040',
  },
  estrategico: {
    type: 'estrategico',
    description: 'Planejamento, visão de longo prazo e decisões calculadas. Xadrez humano.',
    color: '#00d4ff',
  },
  inabalavel: {
    type: 'inabalavel',
    description: 'Resiliente. Não se abala. Mantém foco sob pressão. Mentalidade de aço.',
    color: '#ff0040',
  },
  social: {
    type: 'social',
    description: 'Conexões humanas, comunicação e influência. Rede é poder.',
    color: '#00d4ff',
  },
  personalizada: {
    type: 'personalizada',
    description: 'Defina sua própria identidade. Sem limites.',
    color: '#ff0040',
  },
};

export const MISSION_CATEGORIES: Record<MissionCategory, { name: string; icon: string; color: string }> = {
  corpo: { name: 'Corpo', icon: '⚡', color: '#ff0040' },
  social: { name: 'Social', icon: '🔗', color: '#00d4ff' },
  intelectual: { name: 'Intelectual', icon: '🧠', color: '#00d4ff' },
  financeiro: { name: 'Financeiro', icon: '💎', color: '#ff0040' },
};

export const MOOD_CONFIG: Record<MoodType, { emoji: string; label: string; value: number }> = {
  excelente: { emoji: '🔥', label: 'Excelente', value: 5 },
  bom: { emoji: '⚡', label: 'Bom', value: 4 },
  neutro: { emoji: '➖', label: 'Neutro', value: 3 },
  ruim: { emoji: '🌧️', label: 'Ruim', value: 2 },
  pessimo: { emoji: '💀', label: 'Péssimo', value: 1 },
};
