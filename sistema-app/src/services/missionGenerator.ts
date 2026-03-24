/**
 * ═══════════════════════════════════════════════════════════
 * GERADOR DE 365 MISSÕES DINÂMICAS
 * Ciência de dados: periodização, progressão, variação
 * ═══════════════════════════════════════════════════════════
 *
 * LÓGICA CIENTÍFICA:
 * - Periodização ondulante (ciclos de carga/descarga)
 * - Progressão linear com micro-ciclos
 * - Variação de exercícios para evitar adaptação
 * - Alternância de grupos musculares
 * - Descanso ativo programado a cada 7 dias
 * - Intensidade baseada em fase (iniciante→intermediário→avançado→elite)
 */

import { DailyMission, MissionDifficulty, MissionCategory, ExerciseType } from '@/types';

// ── Templates de Exercícios ──────────────────────────────────
interface ExerciseTemplate {
  type: ExerciseType;
  title: string;
  unit: string;
  category: MissionCategory;
  baseQuantity: number;
  maxQuantity: number;
  caloriesPerUnit: number;
  description: string;
}

const EXERCISE_TEMPLATES: ExerciseTemplate[] = [
  // CORPO - Força
  { type: 'flexao', title: 'Flexões', unit: 'reps', category: 'corpo', baseQuantity: 10, maxQuantity: 100, caloriesPerUnit: 0.5, description: 'Flexões com forma perfeita. Peito no chão.' },
  { type: 'abdominal', title: 'Abdominais', unit: 'reps', category: 'corpo', baseQuantity: 15, maxQuantity: 200, caloriesPerUnit: 0.3, description: 'Crunches com controle total do core.' },
  { type: 'agachamento', title: 'Agachamentos', unit: 'reps', category: 'corpo', baseQuantity: 15, maxQuantity: 150, caloriesPerUnit: 0.6, description: 'Agachamento profundo. Coxas paralelas ao chão.' },
  { type: 'prancha', title: 'Prancha', unit: 'seg', category: 'corpo', baseQuantity: 30, maxQuantity: 300, caloriesPerUnit: 0.15, description: 'Prancha isométrica. Corpo reto como uma tábua.' },
  { type: 'burpee', title: 'Burpees', unit: 'reps', category: 'corpo', baseQuantity: 5, maxQuantity: 50, caloriesPerUnit: 1.5, description: 'Burpee completo. Explosão total do corpo.' },
  { type: 'lunges', title: 'Avanços', unit: 'reps', category: 'corpo', baseQuantity: 10, maxQuantity: 80, caloriesPerUnit: 0.5, description: 'Avanço alternado com joelho tocando o chão.' },
  { type: 'mountain_climber', title: 'Mountain Climbers', unit: 'reps', category: 'corpo', baseQuantity: 20, maxQuantity: 150, caloriesPerUnit: 0.4, description: 'Escalada na posição de prancha. Ritmo intenso.' },
  { type: 'elevacao_pernas', title: 'Elevação de Pernas', unit: 'reps', category: 'corpo', baseQuantity: 10, maxQuantity: 80, caloriesPerUnit: 0.4, description: 'Deitado, elevar pernas a 90°. Sem embalo.' },
  { type: 'tríceps_banco', title: 'Tríceps no Banco', unit: 'reps', category: 'corpo', baseQuantity: 10, maxQuantity: 80, caloriesPerUnit: 0.4, description: 'Apoio no banco/cadeira. Braços a 90°.' },
  { type: 'superman', title: 'Superman', unit: 'reps', category: 'corpo', baseQuantity: 10, maxQuantity: 60, caloriesPerUnit: 0.3, description: 'Extensão lombar. Levantar braços e pernas juntos.' },
  { type: 'panturrilha', title: 'Panturrilha', unit: 'reps', category: 'corpo', baseQuantity: 20, maxQuantity: 150, caloriesPerUnit: 0.2, description: 'Elevação de panturrilha na borda de um degrau.' },
  { type: 'stiff', title: 'Stiff', unit: 'reps', category: 'corpo', baseQuantity: 10, maxQuantity: 60, caloriesPerUnit: 0.5, description: 'Flexão de quadril com pernas semi-estendidas.' },
  { type: 'polichinelo', title: 'Polichinelos', unit: 'reps', category: 'corpo', baseQuantity: 30, maxQuantity: 300, caloriesPerUnit: 0.2, description: 'Jumping jacks em ritmo acelerado.' },

  // CORPO - Cardio
  { type: 'corrida', title: 'Corrida', unit: 'km', category: 'corpo', baseQuantity: 1, maxQuantity: 15, caloriesPerUnit: 70, description: 'Corrida contínua. Mantenha ritmo constante.' },
  { type: 'caminhada', title: 'Caminhada Rápida', unit: 'km', category: 'corpo', baseQuantity: 2, maxQuantity: 12, caloriesPerUnit: 40, description: 'Caminhada em ritmo acelerado (>6km/h).' },
  { type: 'pular_corda', title: 'Pular Corda', unit: 'min', category: 'corpo', baseQuantity: 5, maxQuantity: 30, caloriesPerUnit: 12, description: 'Saltos contínuos. Cardio de alto impacto.' },
  { type: 'bike', title: 'Bicicleta', unit: 'km', category: 'corpo', baseQuantity: 3, maxQuantity: 30, caloriesPerUnit: 35, description: 'Pedalar com intensidade moderada a alta.' },
  { type: 'natacao', title: 'Natação', unit: 'min', category: 'corpo', baseQuantity: 10, maxQuantity: 60, caloriesPerUnit: 10, description: 'Natação livre. Qualquer estilo.' },

  // CORPO - Flexibilidade
  { type: 'yoga', title: 'Sessão de Yoga', unit: 'min', category: 'corpo', baseQuantity: 10, maxQuantity: 45, caloriesPerUnit: 4, description: 'Sequência de yoga. Respiração e postura.' },
  { type: 'alongamento', title: 'Alongamento Completo', unit: 'min', category: 'corpo', baseQuantity: 10, maxQuantity: 30, caloriesPerUnit: 3, description: 'Alongar todos os grupos musculares.' },

  // INTELECTUAL
  { type: 'leitura', title: 'Leitura', unit: 'páginas', category: 'intelectual', baseQuantity: 5, maxQuantity: 50, caloriesPerUnit: 0, description: 'Ler com foco total. Nada de celular.' },
  { type: 'meditacao', title: 'Meditação', unit: 'min', category: 'intelectual', baseQuantity: 5, maxQuantity: 30, caloriesPerUnit: 0, description: 'Mindfulness. Respiração consciente.' },
  { type: 'journaling', title: 'Journaling', unit: 'min', category: 'intelectual', baseQuantity: 5, maxQuantity: 20, caloriesPerUnit: 0, description: 'Escrever reflexões, metas e aprendizados.' },
  { type: 'estudo', title: 'Estudo Focado', unit: 'min', category: 'intelectual', baseQuantity: 15, maxQuantity: 90, caloriesPerUnit: 0, description: 'Aprender algo novo. Deep work.' },

  // SOCIAL
  { type: 'networking', title: 'Networking', unit: 'contatos', category: 'social', baseQuantity: 1, maxQuantity: 5, caloriesPerUnit: 0, description: 'Conectar com alguém novo ou fortalecer laço.' },
  { type: 'voluntariado', title: 'Ação Social', unit: 'min', category: 'social', baseQuantity: 15, maxQuantity: 60, caloriesPerUnit: 0, description: 'Ajudar alguém. Voluntariado ou favor.' },

  // FINANCEIRO
  { type: 'investimento', title: 'Análise Financeira', unit: 'min', category: 'financeiro', baseQuantity: 10, maxQuantity: 45, caloriesPerUnit: 0, description: 'Estudar investimentos ou revisar finanças.' },
  { type: 'economia', title: 'Economia Consciente', unit: 'R$', category: 'financeiro', baseQuantity: 5, maxQuantity: 100, caloriesPerUnit: 0, description: 'Economizar ou investir valor específico.' },
];

// ── Funções de Periodização ──────────────────────────────────

/**
 * Calcula a fase de treino baseada no dia do ano
 * Fases: Iniciante (D1-90), Intermediário (D91-180), Avançado (D181-270), Elite (D271-365)
 */
function getPhase(day: number): { name: string; multiplier: number; phase: number } {
  if (day <= 90) return { name: 'Iniciante', multiplier: 1.0, phase: 1 };
  if (day <= 180) return { name: 'Intermediário', multiplier: 1.4, phase: 2 };
  if (day <= 270) return { name: 'Avançado', multiplier: 1.8, phase: 3 };
  return { name: 'Elite', multiplier: 2.2, phase: 4 };
}

/**
 * Calcula intensidade ondulante dentro de cada semana
 * Seg: Médio | Ter: Alto | Qua: Baixo | Qui: Alto | Sex: Médio | Sáb: HIIT | Dom: Recuperação
 */
function getWeekdayIntensity(dayOfWeek: number): number {
  const intensities = [0.6, 0.8, 1.0, 0.6, 1.0, 0.8, 0.9]; // Dom a Sáb
  return intensities[dayOfWeek] || 0.7;
}

/**
 * Verifica se é dia de descanso ativo (a cada 7 dias)
 */
function isRecoveryDay(day: number): boolean {
  return day % 7 === 0;
}

/**
 * Pseudo-random determinístico (seed-based) para gerar missões consistentes
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/**
 * Calcula dificuldade baseada na fase e intensidade
 */
function getDifficulty(phase: number, intensity: number): MissionDifficulty {
  const score = phase * intensity;
  if (score < 1.2) return 'easy';
  if (score < 2.0) return 'medium';
  if (score < 3.0) return 'hard';
  return 'extreme';
}

/**
 * Calcula XP baseado em dificuldade e categoria
 */
function calculateXP(difficulty: MissionDifficulty, category: MissionCategory): number {
  const base = { corpo: 15, intelectual: 12, social: 10, financeiro: 10 };
  const mult = { easy: 1, medium: 1.5, hard: 2, extreme: 3 };
  return Math.round(base[category] * mult[difficulty]);
}

// ── Gerador Principal ────────────────────────────────────────

/**
 * Gera a missão para um dia específico do ano (1-365)
 * Utiliza periodização científica + variação de exercícios
 */
export function generateMissionForDay(dayOfYear: number): DailyMission {
  const phase = getPhase(dayOfYear);
  const dayOfWeek = dayOfYear % 7;
  const weekIntensity = getWeekdayIntensity(dayOfWeek);
  const recovery = isRecoveryDay(dayOfYear);

  // Selecionar exercício com seed determinístico
  const seed = dayOfYear;
  const random = seededRandom(seed);

  let templateIndex: number;
  let template: ExerciseTemplate;

  if (recovery) {
    // Dia de recuperação: yoga, alongamento, meditação, caminhada
    const recoveryExercises = EXERCISE_TEMPLATES.filter(
      t => ['yoga', 'alongamento', 'meditacao', 'caminhada'].includes(t.type)
    );
    templateIndex = Math.floor(random * recoveryExercises.length);
    template = recoveryExercises[templateIndex];
  } else {
    // Ciclo por categorias com dominância de corpo
    const weekNumber = Math.ceil(dayOfYear / 7);
    const cycleDay = dayOfYear % 5; // Ciclo de 5: corpo, corpo, intelectual, social, financeiro

    let categoryPool: ExerciseTemplate[];
    if (cycleDay <= 1) {
      categoryPool = EXERCISE_TEMPLATES.filter(t => t.category === 'corpo');
    } else if (cycleDay === 2) {
      categoryPool = EXERCISE_TEMPLATES.filter(t => t.category === 'intelectual');
    } else if (cycleDay === 3) {
      categoryPool = EXERCISE_TEMPLATES.filter(t => t.category === 'social');
    } else {
      categoryPool = EXERCISE_TEMPLATES.filter(t => t.category === 'financeiro');
    }

    // Usar seed para selecionar exercício da pool
    const secondRandom = seededRandom(seed * 7 + weekNumber);
    templateIndex = Math.floor(secondRandom * categoryPool.length);
    template = categoryPool[templateIndex];
  }

  // Calcular quantidade com progressão
  const progressionFactor = phase.multiplier * weekIntensity;
  const range = template.maxQuantity - template.baseQuantity;
  const progressRatio = Math.min((dayOfYear - 1) / 364, 1); // 0 a 1
  const baseForDay = template.baseQuantity + range * progressRatio * 0.7;
  const quantity = Math.round(baseForDay * (recovery ? 0.5 : progressionFactor));

  // Garantir quantidade mínima
  const finalQuantity = Math.max(template.baseQuantity, Math.min(quantity, template.maxQuantity));

  const difficulty = recovery ? 'easy' : getDifficulty(phase.phase, weekIntensity);
  const xp = calculateXP(difficulty, template.category);
  const calories = Math.round(finalQuantity * template.caloriesPerUnit);

  const id = `mission-day-${dayOfYear}`;

  return {
    id,
    dayOfYear,
    title: `${template.title} — ${finalQuantity} ${template.unit}`,
    description: `${template.description}\n\nFase: ${phase.name} | Intensidade: ${Math.round(weekIntensity * 100)}%${recovery ? ' | 🧘 DIA DE RECUPERAÇÃO' : ''}`,
    exerciseType: template.type,
    category: template.category,
    quantity: finalQuantity,
    unit: template.unit,
    xp,
    difficulty,
    completed: false,
    caloriesBurned: calories,
  };
}

/**
 * Gera todas as 365 missões do ano
 */
export function generateAllMissions(): DailyMission[] {
  const missions: DailyMission[] = [];
  for (let day = 1; day <= 365; day++) {
    missions.push(generateMissionForDay(day));
  }
  return missions;
}

/**
 * Gera missões para um mês específico
 */
export function generateMissionsForMonth(month: number, year: number): DailyMission[] {
  const startDate = new Date(year, month - 1, 1);
  const startDayOfYear = getDayOfYear(startDate);
  const daysInMonth = new Date(year, month, 0).getDate();

  const missions: DailyMission[] = [];
  for (let i = 0; i < daysInMonth; i++) {
    const dayOfYear = Math.min(startDayOfYear + i, 365);
    missions.push(generateMissionForDay(dayOfYear));
  }
  return missions;
}

/**
 * Retorna o dia do ano para uma data
 */
export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Retorna data a partir do dia do ano
 */
export function dateFromDayOfYear(dayOfYear: number, year?: number): Date {
  const y = year || new Date().getFullYear();
  const date = new Date(y, 0);
  date.setDate(dayOfYear);
  return date;
}
