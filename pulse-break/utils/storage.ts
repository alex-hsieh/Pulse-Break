import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CheckIn {
  id: string;
  timestamp: string;
  stressLevel: number;
  notes?: string;
}

const CHECKINS_KEY = 'pulse_break_checkins';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function saveCheckIn(stressLevel: number, notes?: string, existingId?: string): Promise<CheckIn> {
  const entry: CheckIn = {
    id: existingId ?? generateId(),
    timestamp: new Date().toISOString(),
    stressLevel,
    notes,
  };
  const existing = await getCheckIns();
  const updated = [entry, ...existing];
  await AsyncStorage.setItem(CHECKINS_KEY, JSON.stringify(updated));
  return entry;
}

export async function getCheckIns(): Promise<CheckIn[]> {
  try {
    const raw = await AsyncStorage.getItem(CHECKINS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export interface Reflection {
  id: string;
  checkInId: string;
  timestamp: string;
  promptShown: string;
  userResponse: 'controllable' | 'uncontrollable';
}

const REFLECTIONS_KEY = 'pulse_break_reflections';

export async function saveReflection(
  checkInId: string,
  promptShown: string,
  userResponse: 'controllable' | 'uncontrollable'
): Promise<Reflection> {
  const entry: Reflection = {
    id: generateId(),
    checkInId,
    timestamp: new Date().toISOString(),
    promptShown,
    userResponse,
  };
  const existing = await getReflections();
  const updated = [entry, ...existing];
  await AsyncStorage.setItem(REFLECTIONS_KEY, JSON.stringify(updated));
  return entry;
}

export async function getReflections(): Promise<Reflection[]> {
  try {
    const raw = await AsyncStorage.getItem(REFLECTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export interface JournalEntry {
  id: string;
  checkInId: string;
  timestamp: string;
  title?: string;
  body: string;
  moodTag?: 'release' | 'reframe' | 'gratitude' | 'next_step';
}

const JOURNALS_KEY = 'pulse_break_journals';

export async function saveJournalEntry(
  checkInId: string,
  body: string,
  options?: {
    title?: string;
    moodTag?: JournalEntry['moodTag'];
  }
): Promise<JournalEntry> {
  const entry: JournalEntry = {
    id: generateId(),
    checkInId,
    timestamp: new Date().toISOString(),
    title: options?.title,
    body,
    moodTag: options?.moodTag,
  };
  const existing = await getJournalEntries();
  const updated = [entry, ...existing];
  await AsyncStorage.setItem(JOURNALS_KEY, JSON.stringify(updated));
  return entry;
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(JOURNALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function getWeeklyCheckIns(): Promise<CheckIn[]> {
  const all = await getCheckIns();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return all.filter(c => new Date(c.timestamp) >= sevenDaysAgo);
}

export interface ControlRatio {
  controllable: number;
  uncontrollable: number;
  total: number;
}

export async function getWeeklyControlRatio(): Promise<ControlRatio> {
  const all = await getReflections();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weekly = all.filter(r => new Date(r.timestamp) >= sevenDaysAgo);
  const controllable = weekly.filter(r => r.userResponse === 'controllable').length;
  const uncontrollable = weekly.filter(r => r.userResponse === 'uncontrollable').length;
  return { controllable, uncontrollable, total: weekly.length };
}

export interface WellnessScore {
  score: number;
  label: 'Building' | 'Steady' | 'Thriving' | 'Excellent';
}

export async function getWeeklyWellnessScore(): Promise<WellnessScore> {
  const checkIns = await getWeeklyCheckIns();
  const reflections = await getReflections();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weeklyReflections = reflections.filter(r => new Date(r.timestamp) >= sevenDaysAgo);

  // 1. Consistency: unique days with check-ins out of 7
  const uniqueDays = new Set(checkIns.map(c => c.timestamp.slice(0, 10))).size;
  const consistencyScore = (uniqueDays / 7) * 4; // max 4 pts

  // 2. Stress level: avg stress this week, lower = better
  const avgStress = checkIns.length > 0
    ? checkIns.reduce((sum, c) => sum + c.stressLevel, 0) / checkIns.length
    : 3;
  const stressScore = ((5 - avgStress) / 4) * 3; // max 3 pts

  // 3. Reflection follow-through: reflections vs check-ins
  const reflectionScore = checkIns.length > 0
    ? (weeklyReflections.length / checkIns.length) * 3 // max 3 pts
    : 0;

  const raw = consistencyScore + stressScore + reflectionScore;
  const score = Math.round(Math.min(10, Math.max(0, raw)));

  let label: WellnessScore['label'];
  if (score <= 4) label = 'Building';
  else if (score <= 6) label = 'Steady';
  else if (score <= 8) label = 'Thriving';
  else label = 'Excellent';

  return { score, label };
}
