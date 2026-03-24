/**
 * ═══════════════════════════════════════════════════════════
 * BANCO DE DADOS IndexedDB - Persistência Avançada
 * Operações CRUD completas com índices e queries
 * ═══════════════════════════════════════════════════════════
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import {
  User, DailyMission, ParallelMission, DailyProgress,
  EmotionalLog, WeeklyStats, MonthlyStats,
} from '@/types';

// ── Schema do Banco ──────────────────────────────────────────
interface SistemaDB extends DBSchema {
  users: {
    key: string;
    value: User;
  };
  daily_missions: {
    key: string;
    value: DailyMission;
    indexes: {
      'by-day': number;
      'by-category': string;
      'by-completed': number;
    };
  };
  parallel_missions: {
    key: string;
    value: ParallelMission;
    indexes: {
      'by-category': string;
    };
  };
  daily_progress: {
    key: string;
    value: DailyProgress;
    indexes: {
      'by-date': string;
      'by-day': number;
    };
  };
  emotional_logs: {
    key: string;
    value: EmotionalLog;
    indexes: {
      'by-date': string;
    };
  };
}

const DB_NAME = 'SistemaDB';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<SistemaDB> | null = null;

// ── Inicialização ────────────────────────────────────────────
export async function getDB(): Promise<IDBPDatabase<SistemaDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<SistemaDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Users store
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
      }

      // Daily Missions store
      if (!db.objectStoreNames.contains('daily_missions')) {
        const missionStore = db.createObjectStore('daily_missions', { keyPath: 'id' });
        missionStore.createIndex('by-day', 'dayOfYear');
        missionStore.createIndex('by-category', 'category');
        missionStore.createIndex('by-completed', 'completed');
      }

      // Parallel Missions store
      if (!db.objectStoreNames.contains('parallel_missions')) {
        const parallelStore = db.createObjectStore('parallel_missions', { keyPath: 'id' });
        parallelStore.createIndex('by-category', 'category');
      }

      // Daily Progress store
      if (!db.objectStoreNames.contains('daily_progress')) {
        const progressStore = db.createObjectStore('daily_progress', { keyPath: 'date' });
        progressStore.createIndex('by-date', 'date');
        progressStore.createIndex('by-day', 'dayOfYear');
      }

      // Emotional Logs store
      if (!db.objectStoreNames.contains('emotional_logs')) {
        const emotionalStore = db.createObjectStore('emotional_logs', { keyPath: 'id' });
        emotionalStore.createIndex('by-date', 'date');
      }
    },
  });

  return dbInstance;
}

// ══════════════════════════════════════════════════════════════
// USER OPERATIONS
// ══════════════════════════════════════════════════════════════

export async function saveUser(user: User): Promise<void> {
  const db = await getDB();
  await db.put('users', user);
}

export async function getUser(): Promise<User | undefined> {
  const db = await getDB();
  const users = await db.getAll('users');
  return users[0];
}

export async function deleteUser(): Promise<void> {
  const db = await getDB();
  const users = await db.getAll('users');
  for (const user of users) {
    await db.delete('users', user.id);
  }
}

// ══════════════════════════════════════════════════════════════
// DAILY MISSION OPERATIONS
// ══════════════════════════════════════════════════════════════

export async function saveDailyMission(mission: DailyMission): Promise<void> {
  const db = await getDB();
  await db.put('daily_missions', mission);
}

export async function saveDailyMissions(missions: DailyMission[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('daily_missions', 'readwrite');
  for (const mission of missions) {
    await tx.store.put(mission);
  }
  await tx.done;
}

export async function getDailyMission(id: string): Promise<DailyMission | undefined> {
  const db = await getDB();
  return db.get('daily_missions', id);
}

export async function getMissionByDay(dayOfYear: number): Promise<DailyMission | undefined> {
  const db = await getDB();
  const missions = await db.getAllFromIndex('daily_missions', 'by-day', dayOfYear);
  return missions[0];
}

export async function getAllDailyMissions(): Promise<DailyMission[]> {
  const db = await getDB();
  return db.getAll('daily_missions');
}

export async function getCompletedMissions(): Promise<DailyMission[]> {
  const db = await getDB();
  const all = await db.getAll('daily_missions');
  return all.filter(m => m.completed);
}

export async function getMissionsByCategory(category: string): Promise<DailyMission[]> {
  const db = await getDB();
  return db.getAllFromIndex('daily_missions', 'by-category', category);
}

export async function completeDailyMission(
  id: string,
  completedQuantity?: number,
  timeSpent?: number,
): Promise<DailyMission | undefined> {
  const db = await getDB();
  const mission = await db.get('daily_missions', id);
  if (!mission) return undefined;

  mission.completed = true;
  mission.completedAt = new Date().toISOString();
  mission.completedQuantity = completedQuantity || mission.quantity;
  mission.timeSpent = timeSpent || 0;

  await db.put('daily_missions', mission);
  return mission;
}

// ══════════════════════════════════════════════════════════════
// PARALLEL MISSION OPERATIONS
// ══════════════════════════════════════════════════════════════

export async function saveParallelMission(mission: ParallelMission): Promise<void> {
  const db = await getDB();
  await db.put('parallel_missions', mission);
}

export async function getParallelMissions(): Promise<ParallelMission[]> {
  const db = await getDB();
  return db.getAll('parallel_missions');
}

export async function completeParallelMission(id: string): Promise<ParallelMission | undefined> {
  const db = await getDB();
  const mission = await db.get('parallel_missions', id);
  if (!mission) return undefined;

  mission.completed = true;
  mission.completedAt = new Date().toISOString();
  await db.put('parallel_missions', mission);
  return mission;
}

export async function deleteParallelMission(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('parallel_missions', id);
}

// ══════════════════════════════════════════════════════════════
// DAILY PROGRESS OPERATIONS
// ══════════════════════════════════════════════════════════════

export async function saveDailyProgress(progress: DailyProgress): Promise<void> {
  const db = await getDB();
  await db.put('daily_progress', progress);
}

export async function getDailyProgressByDate(date: string): Promise<DailyProgress | undefined> {
  const db = await getDB();
  return db.get('daily_progress', date);
}

export async function getAllProgress(): Promise<DailyProgress[]> {
  const db = await getDB();
  return db.getAll('daily_progress');
}

export async function getProgressRange(startDate: string, endDate: string): Promise<DailyProgress[]> {
  const db = await getDB();
  const all = await db.getAll('daily_progress');
  return all.filter(p => p.date >= startDate && p.date <= endDate);
}

// ══════════════════════════════════════════════════════════════
// EMOTIONAL LOG OPERATIONS
// ══════════════════════════════════════════════════════════════

export async function saveEmotionalLog(log: EmotionalLog): Promise<void> {
  const db = await getDB();
  await db.put('emotional_logs', log);
}

export async function getEmotionalLogs(): Promise<EmotionalLog[]> {
  const db = await getDB();
  return db.getAll('emotional_logs');
}

export async function getEmotionalLogByDate(date: string): Promise<EmotionalLog | undefined> {
  const db = await getDB();
  const logs = await db.getAllFromIndex('emotional_logs', 'by-date', date);
  return logs[0];
}

// ══════════════════════════════════════════════════════════════
// ANALYTICS / CIÊNCIA DE DADOS
// ══════════════════════════════════════════════════════════════

/**
 * Calcula estatísticas semanais
 */
export async function getWeeklyStats(weekNumber: number): Promise<WeeklyStats> {
  const allProgress = await getAllProgress();
  const weekStart = (weekNumber - 1) * 7 + 1;
  const weekEnd = weekStart + 6;

  const weekData = allProgress.filter(
    p => p.dayOfYear >= weekStart && p.dayOfYear <= weekEnd
  );

  const totalXP = weekData.reduce((s, d) => s + d.xpEarned, 0);
  const totalCalories = weekData.reduce((s, d) => s + d.caloriesBurned, 0);
  const totalTime = weekData.reduce((s, d) => s + d.timeSpent, 0);
  const completed = weekData.reduce((s, d) => s + d.missionsCompleted, 0);
  const total = weekData.reduce((s, d) => s + d.totalMissions, 0);
  const moods = weekData.filter(d => d.mood).map(d => {
    const moodValues: Record<string, number> = { excelente: 5, bom: 4, neutro: 3, ruim: 2, pessimo: 1 };
    return moodValues[d.mood || 'neutro'];
  });

  return {
    weekNumber,
    totalXP,
    totalCalories,
    totalTime,
    avgMood: moods.length ? moods.reduce((a, b) => a + b, 0) / moods.length : 0,
    avgEnergy: weekData.filter(d => d.energy).reduce((s, d) => s + (d.energy || 0), 0) / (weekData.length || 1),
    avgMotivation: weekData.filter(d => d.motivation).reduce((s, d) => s + (d.motivation || 0), 0) / (weekData.length || 1),
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    missionsCompleted: completed,
    totalMissions: total,
  };
}

/**
 * Calcula estatísticas mensais
 */
export async function getMonthlyStats(month: number, year: number): Promise<MonthlyStats> {
  const allProgress = await getAllProgress();
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  const monthData = allProgress.filter(p => p.date.startsWith(monthStr));

  const totalXP = monthData.reduce((s, d) => s + d.xpEarned, 0);
  const totalCalories = monthData.reduce((s, d) => s + d.caloriesBurned, 0);
  const totalTime = monthData.reduce((s, d) => s + d.timeSpent, 0);
  const completed = monthData.reduce((s, d) => s + d.missionsCompleted, 0);
  const total = monthData.reduce((s, d) => s + d.totalMissions, 0);

  let bestDay = '', worstDay = '', bestXP = 0, worstXP = Infinity;
  monthData.forEach(d => {
    if (d.xpEarned > bestXP) { bestXP = d.xpEarned; bestDay = d.date; }
    if (d.xpEarned < worstXP) { worstXP = d.xpEarned; worstDay = d.date; }
  });

  let longestStreak = 0, currentStreak = 0;
  monthData.forEach(d => {
    if (d.missionsCompleted > 0) { currentStreak++; longestStreak = Math.max(longestStreak, currentStreak); }
    else { currentStreak = 0; }
  });

  const moods = monthData.filter(d => d.mood).map(d => {
    const v: Record<string, number> = { excelente: 5, bom: 4, neutro: 3, ruim: 2, pessimo: 1 };
    return v[d.mood || 'neutro'];
  });

  return {
    month, year, totalXP, totalCalories, totalTime,
    avgMood: moods.length ? moods.reduce((a, b) => a + b, 0) / moods.length : 0,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    bestDay, worstDay, longestStreak,
  };
}

/**
 * Calcula streak atual
 */
export async function getCurrentStreak(): Promise<number> {
  const allProgress = await getAllProgress();
  if (allProgress.length === 0) return 0;

  const sorted = [...allProgress].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];

  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().split('T')[0];

    if (sorted[i]?.date === expectedStr && sorted[i].missionsCompleted > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// ══════════════════════════════════════════════════════════════
// RESET / CLEAR
// ══════════════════════════════════════════════════════════════

export async function clearAllData(): Promise<void> {
  const db = await getDB();
  await db.clear('users');
  await db.clear('daily_missions');
  await db.clear('parallel_missions');
  await db.clear('daily_progress');
  await db.clear('emotional_logs');
}
