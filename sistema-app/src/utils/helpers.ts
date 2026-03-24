/**
 * ═══════════════════════════════════════════════════════════
 * UTILITÁRIOS GLOBAIS + ANÁLISE DE DADOS
 * ═══════════════════════════════════════════════════════════
 */

import { XP_CONFIG, MissionDifficulty } from '@/types';

/** Calcula XP necessário para o próximo nível */
export const calculateXPForLevel = (level: number): number => {
  return Math.floor(XP_CONFIG.LEVEL_BASE_XP * Math.pow(XP_CONFIG.LEVEL_MULTIPLIER, level - 1));
};

/** Calcula nível baseado no XP total */
export const calculateLevel = (totalXP: number): { level: number; currentXP: number; xpToNextLevel: number } => {
  let level = 1;
  let cumulativeXP = 0;
  while (cumulativeXP + calculateXPForLevel(level) <= totalXP) {
    cumulativeXP += calculateXPForLevel(level);
    level++;
  }
  return { level, currentXP: totalXP - cumulativeXP, xpToNextLevel: calculateXPForLevel(level) };
};

/** Gera ID único */
export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/** Formata data pt-BR */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

/** Formata data curta */
export const formatDateShort = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

/** Saudação */
export const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
};

/** Dia do ano */
export const getDayOfYear = (date: Date = new Date()): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

/** Nome do mês */
export const getMonthName = (month: number): string => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return months[month] || '';
};

/** Nome completo do mês */
export const getMonthNameFull = (month: number): string => {
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return months[month] || '';
};

/** Cor da dificuldade */
export const getDifficultyColor = (diff: MissionDifficulty): string => {
  switch (diff) {
    case 'easy': return '#00d4ff';
    case 'medium': return '#00d4ff';
    case 'hard': return '#ff0040';
    case 'extreme': return '#ff0040';
    default: return '#ffffff';
  }
};

/** Label da dificuldade */
export const getDifficultyLabel = (diff: MissionDifficulty): string => {
  switch (diff) {
    case 'easy': return 'FÁCIL';
    case 'medium': return 'MÉDIO';
    case 'hard': return 'DIFÍCIL';
    case 'extreme': return 'EXTREMO';
    default: return '';
  }
};

/** Calcula porcentagem com segurança */
export const safePercent = (a: number, b: number): number => {
  if (b === 0) return 0;
  return Math.min(Math.round((a / b) * 100), 100);
};

/** Formata número com separador de milhar */
export const formatNumber = (n: number): string => {
  return n.toLocaleString('pt-BR');
};

/** Média de array */
export const average = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

/** Desvio padrão */
export const standardDeviation = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  const avg = average(arr);
  const diffs = arr.map(v => Math.pow(v - avg, 2));
  return Math.sqrt(average(diffs));
};

/** Mediana */
export const median = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

/** Tendência (regressão linear simples) */
export const trend = (data: number[]): 'up' | 'down' | 'stable' => {
  if (data.length < 3) return 'stable';
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i];
    sumXY += i * data[i];
    sumXX += i * i;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  if (slope > 0.5) return 'up';
  if (slope < -0.5) return 'down';
  return 'stable';
};
