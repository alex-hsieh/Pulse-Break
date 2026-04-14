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

export async function saveCheckIn(stressLevel: number, notes?: string): Promise<CheckIn> {
  const entry: CheckIn = {
    id: generateId(),
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