/**
 * ═══════════════════════════════════════════════════════════
 * CONTEXT GLOBAL - Estado do App com IndexedDB
 * ═══════════════════════════════════════════════════════════
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Identity, DailyMission, ParallelMission, DailyProgress, EmotionalLog, MissionCategory } from '@/types';
import * as db from '@/services/database';
import { generateMissionForDay, getDayOfYear } from '@/services/missionGenerator';
import { calculateLevel, generateId } from '@/utils/helpers';

interface AppContextType {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  todayMission: DailyMission | null;
  allMissions: DailyMission[];
  parallelMissions: ParallelMission[];
  progress: DailyProgress[];
  emotionalLogs: EmotionalLog[];
  currentStreak: number;

  setIdentity: (identity: Identity) => Promise<void>;
  completeTodayMission: (completedQty?: number, timeSpent?: number) => Promise<void>;
  addParallelMission: (title: string, category: MissionCategory, desc?: string, xp?: number) => Promise<void>;
  completeParallelMission: (id: string) => Promise<void>;
  removeParallelMission: (id: string) => Promise<void>;
  logEmotion: (mood: EmotionalLog['mood'], energy: number, motivation: number, note?: string) => Promise<void>;
  getMissionForDay: (dayOfYear: number) => DailyMission;
  refreshData: () => Promise<void>;
  resetApp: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [todayMission, setTodayMission] = useState<DailyMission | null>(null);
  const [allMissions, setAllMissions] = useState<DailyMission[]>([]);
  const [parallelMissions, setParallelMissions] = useState<ParallelMission[]>([]);
  const [progress, setProgress] = useState<DailyProgress[]>([]);
  const [emotionalLogs, setEmotionalLogs] = useState<EmotionalLog[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  const today = getDayOfYear(new Date());

  // ── Carregar dados ──────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      const storedUser = await db.getUser();
      if (storedUser) {
        setUser(storedUser);
        setInitialized(true);

        // Carregar missão de hoje
        let mission = await db.getMissionByDay(today);
        if (!mission) {
          mission = generateMissionForDay(today);
          await db.saveDailyMission(mission);
        }
        setTodayMission(mission);

        // Carregar todas as missões
        const missions = await db.getAllDailyMissions();
        setAllMissions(missions);

        // Carregar missões paralelas
        const parallel = await db.getParallelMissions();
        setParallelMissions(parallel);

        // Carregar progresso
        const prog = await db.getAllProgress();
        setProgress(prog);

        // Carregar logs emocionais
        const logs = await db.getEmotionalLogs();
        setEmotionalLogs(logs);

        // Calcular streak
        const streak = await db.getCurrentStreak();
        setCurrentStreak(streak);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Refresh ─────────────────────────────────────────────────
  const refreshData = async () => { await loadData(); };

  // ── Selecionar Identidade ───────────────────────────────────
  const setIdentity = async (identity: Identity) => {
    const now = new Date().toISOString();
    const newUser: User = {
      id: generateId(),
      identity,
      level: 1,
      totalXP: 0,
      currentXP: 0,
      xpToNextLevel: 100,
      completedMissionsCount: 0,
      consistencyRate: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalCaloriesBurned: 0,
      totalTimeSpent: 0,
      createdAt: now,
      lastActive: now,
    };

    await db.saveUser(newUser);

    // Gerar missão de hoje
    const mission = generateMissionForDay(today);
    await db.saveDailyMission(mission);

    setUser(newUser);
    setTodayMission(mission);
    setInitialized(true);
  };

  // ── Completar Missão de Hoje ────────────────────────────────
  const completeTodayMission = async (completedQty?: number, timeSpent?: number) => {
    if (!todayMission || !user || todayMission.completed) return;

    const updated = await db.completeDailyMission(todayMission.id, completedQty, timeSpent);
    if (!updated) return;

    // Atualizar XP do usuário
    const newTotalXP = user.totalXP + updated.xp;
    const levelData = calculateLevel(newTotalXP);
    const streak = await db.getCurrentStreak();

    const updatedUser: User = {
      ...user,
      totalXP: newTotalXP,
      level: levelData.level,
      currentXP: levelData.currentXP,
      xpToNextLevel: levelData.xpToNextLevel,
      completedMissionsCount: user.completedMissionsCount + 1,
      currentStreak: streak + 1,
      longestStreak: Math.max(user.longestStreak, streak + 1),
      totalCaloriesBurned: user.totalCaloriesBurned + (updated.caloriesBurned || 0),
      totalTimeSpent: user.totalTimeSpent + (updated.timeSpent || 0),
      lastActive: new Date().toISOString(),
    };

    await db.saveUser(updatedUser);

    // Salvar progresso diário
    const todayStr = new Date().toISOString().split('T')[0];
    const existingProgress = await db.getDailyProgressByDate(todayStr);
    const dailyProg: DailyProgress = {
      date: todayStr,
      dayOfYear: today,
      missionsCompleted: (existingProgress?.missionsCompleted || 0) + 1,
      totalMissions: (existingProgress?.totalMissions || 0) + 1,
      xpEarned: (existingProgress?.xpEarned || 0) + updated.xp,
      caloriesBurned: (existingProgress?.caloriesBurned || 0) + (updated.caloriesBurned || 0),
      timeSpent: (existingProgress?.timeSpent || 0) + (updated.timeSpent || 0),
      streakCount: streak + 1,
    };
    await db.saveDailyProgress(dailyProg);

    setUser(updatedUser);
    setTodayMission(updated);
    setCurrentStreak(streak + 1);
    await refreshData();
  };

  // ── Missões Paralelas ───────────────────────────────────────
  const addParallelMission = async (title: string, category: MissionCategory, desc?: string, xp: number = 10) => {
    const mission: ParallelMission = {
      id: generateId(),
      title,
      description: desc,
      category,
      xp,
      completed: false,
      createdAt: new Date().toISOString(),
      coherent: true,
      recurring: false,
    };
    await db.saveParallelMission(mission);
    await refreshData();
  };

  const completeParallelMissionHandler = async (id: string) => {
    const mission = await db.completeParallelMission(id);
    if (mission && user) {
      const newTotalXP = user.totalXP + mission.xp;
      const levelData = calculateLevel(newTotalXP);
      const updatedUser = {
        ...user,
        totalXP: newTotalXP,
        level: levelData.level,
        currentXP: levelData.currentXP,
        xpToNextLevel: levelData.xpToNextLevel,
        completedMissionsCount: user.completedMissionsCount + 1,
        lastActive: new Date().toISOString(),
      };
      await db.saveUser(updatedUser);
      setUser(updatedUser);
    }
    await refreshData();
  };

  const removeParallelMission = async (id: string) => {
    await db.deleteParallelMission(id);
    await refreshData();
  };

  // ── Log Emocional ───────────────────────────────────────────
  const logEmotion = async (mood: EmotionalLog['mood'], energy: number, motivation: number, note?: string) => {
    const log: EmotionalLog = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      mood,
      energy,
      motivation,
      note,
    };
    await db.saveEmotionalLog(log);
    await refreshData();
  };

  // ── Obter missão para dia específico ────────────────────────
  const getMissionForDay = (dayOfYear: number): DailyMission => {
    const existing = allMissions.find(m => m.dayOfYear === dayOfYear);
    if (existing) return existing;
    return generateMissionForDay(dayOfYear);
  };

  // ── Reset ───────────────────────────────────────────────────
  const resetApp = async () => {
    await db.clearAllData();
    setUser(null);
    setTodayMission(null);
    setAllMissions([]);
    setParallelMissions([]);
    setProgress([]);
    setEmotionalLogs([]);
    setCurrentStreak(0);
    setInitialized(false);
  };

  return (
    <AppContext.Provider value={{
      user, loading, initialized, todayMission, allMissions, parallelMissions,
      progress, emotionalLogs, currentStreak,
      setIdentity, completeTodayMission, addParallelMission,
      completeParallelMission: completeParallelMissionHandler,
      removeParallelMission, logEmotion, getMissionForDay, refreshData, resetApp,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
};
