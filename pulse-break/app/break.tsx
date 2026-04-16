import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Easing, ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';

const COLORS = {
  sage: '#7A9E7E',
  sagePale: '#EAF2EB',
  teal: '#3D8B8B',
  tealPale: '#E4F2F2',
  coral: '#D4715A',
  coralPale: '#FAE9E4',
  amber: '#D4A055',
  amberPale: '#FAF0DF',
  cream: '#F8F5EF',
  ink: '#1C2B2B',
  inkMid: '#3D5050',
  inkSoft: '#7A9090',
  white: '#FDFCFA',
};



const TIER_CONFIG = {
  moderate: {
    eyebrow: 'Elevated stress detected',
    header: "A short pause can help reset.",
    duration: 5 * 60,
    durationLabel: '5 minutes',
    accentColor: COLORS.amber,
    tier: 'Tier 1 — Light',
    tips: ['Take 5 slow, deep breaths', 'Drink a glass of water', 'Step back from your screen briefly'],
  },
  high: {
    eyebrow: 'High stress detected',
    header: "Let's take a break to reset.",
    duration: 10 * 60,
    durationLabel: '10 minutes',
    accentColor: COLORS.coral,
    tier: 'Tier 2 — Guided',
    tips: ['Step away from your screen', 'Take 5 slow, deep breaths', 'Drink a glass of water', 'Take a short walk'],
  },
  very_high: {
    eyebrow: 'Urgent — very high stress',
    header: "You need a break right now.",
    duration: 15 * 60,
    durationLabel: '15 minutes',
    accentColor: COLORS.coral,
    tier: 'Tier 3 — Full Break',
    tips: ['Step fully away from your desk', 'Take a slow walk if you can', 'Box breathe: inhale 4s, hold 4s, exhale 4s', 'Drink water — avoid caffeine', 'Do not check messages yet'],
  },
};

const BREATH_PHASES = [
  { label: 'Inhale', duration: 4000 },
  { label: 'Hold',   duration: 4000 },
  { label: 'Exhale', duration: 4000 },
  { label: 'Hold',   duration: 4000 },
];

const TIER2_ROTATING_TIPS = [
  { icon: '💧', text: 'Drink a full glass of water' },
  { icon: '🚶', text: 'Stand up and take a short walk' },
  { icon: '🙆', text: 'Roll your shoulders and stretch your neck' },
  { icon: '👁️', text: 'Look at something 20 feet away for 20 seconds' },
];

const TIER3_CHECKLIST = [
  { icon: '🚶', text: 'Step away from your desk' },
  { icon: '💧', text: 'Drink water — skip the caffeine' },
  { icon: '📵', text: 'Put your phone face down' },
  { icon: '🌬️', text: 'Box breathe: 4s in, hold, out, hold' },
  { icon: '☀️', text: 'Get outside or near a window' },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getNextBreakWindow(): string {
  const now = new Date();
  const remainder = 15 - (now.getMinutes() % 15);
  const start = new Date(now.getTime() + remainder * 60000);
  const end = new Date(start.getTime() + 15 * 60000);
  const fmt = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${fmt(start)} — ${fmt(end)}`;
}

export default function BreakScreen() {
  const router = useRouter();
  const { checkInId, stressCategory } = useLocalSearchParams<{ checkInId: string; stressCategory: string }>();

  const rawCat = stressCategory as string;
  const category: keyof typeof TIER_CONFIG =
    rawCat === 'moderate' || rawCat === 'high' || rawCat === 'very_high' ? rawCat : 'high';
  const config = TIER_CONFIG[category];

  const [timerActive, setTimerActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(() => config.duration);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseLabel, setPhaseLabel] = useState(BREATH_PHASES[0].label);
  const [rotatingTipIndex, setRotatingTipIndex] = useState(0);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(TIER3_CHECKLIST.map(() => false));

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tipTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathScale = useRef(new Animated.Value(1)).current;
  const breathAnim = useRef<Animated.CompositeAnimation | null>(null);
  const currentPhaseRef = useRef(0);

  const breakWindow = getNextBreakWindow();

  // Reset all state on every focus
  useFocusEffect(
    useCallback(() => {
      setTimerActive(false);
      setPaused(false);
      setSecondsLeft(config.duration);
      setPhaseIndex(0);
      setPhaseLabel(BREATH_PHASES[0].label);
      setCheckedItems(TIER3_CHECKLIST.map(() => false));
      setRotatingTipIndex(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (tipTimerRef.current) clearInterval(tipTimerRef.current);
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      if (breathAnim.current) breathAnim.current.stop();
      breathScale.setValue(1);
      currentPhaseRef.current = 0;
    }, [config.duration])
  );

  useEffect(() => {
    if (timerActive && !paused) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            stopBreathing();
            router.push({ pathname: '/reflection', params: { checkInId } } as any);
            return 0;
          }
          return s - 1;
        });
      }, 1000);

      if (category === 'high') {
        tipTimerRef.current = setInterval(() => {
          setRotatingTipIndex(i => (i + 1) % TIER2_ROTATING_TIPS.length);
        }, 2 * 60 * 1000);
      }
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (tipTimerRef.current) clearInterval(tipTimerRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (tipTimerRef.current) clearInterval(tipTimerRef.current);
    };
  }, [timerActive, paused]);

  function runPhase(index: number) {
    const phase = BREATH_PHASES[index];
    currentPhaseRef.current = index;
    setPhaseLabel(phase.label);
    setPhaseIndex(index);
    const toScale = phase.label === 'Inhale' ? 1.35 : phase.label === 'Exhale' ? 1 : undefined;
    if (toScale !== undefined) {
      breathAnim.current = Animated.timing(breathScale, {
        toValue: toScale,
        duration: phase.duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      });
      breathAnim.current.start();
    }
    phaseTimerRef.current = setTimeout(() => {
      runPhase((index + 1) % BREATH_PHASES.length);
    }, phase.duration);
  }

  function startBreathing(fromIndex?: number) {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    runPhase(fromIndex ?? currentPhaseRef.current);
  }

  function stopBreathing() {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    if (breathAnim.current) breathAnim.current.stop();
  }

  function handleStart() {
    setTimerActive(true);
    setPaused(false);
    if (category !== 'very_high') startBreathing(0);
  }

  function handlePause() {
    setPaused(p => {
      if (!p) stopBreathing();
      else if (category !== 'very_high') startBreathing();
      return !p;
    });
  }

  function handleSkip() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    stopBreathing();
    router.push('/check_in' as any);
  }

  function handleDoneEarly() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    stopBreathing();
    router.push({ pathname: '/reflection', params: { checkInId, stressCategory: category, breakDuration: String(config.duration - secondsLeft) } } as any);
  }

  function toggleCheck(i: number) {
    setCheckedItems(prev => prev.map((v, idx) => idx === i ? !v : v));
  }

  useEffect(() => {
    return () => {
      stopBreathing();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (tipTimerRef.current) clearInterval(tipTimerRef.current);
    };
  }, []);

  const phaseColor =
    phaseLabel === 'Inhale' ? COLORS.teal :
    phaseLabel === 'Exhale' ? COLORS.sage :
    COLORS.inkSoft;

  const checkedCount = checkedItems.filter(Boolean).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: config.accentColor }]}>
      <View style={[styles.headerBar,{ backgroundColor: config.accentColor }]}>
        <Text style={styles.headerEyebrow}>{config.eyebrow}</Text>
        <View style={styles.tierBadge}>
          <Text style={styles.tierBadgeText}>{config.tier}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>{config.header}</Text>

        {!timerActive ? (
          <>
            <View style={styles.tierCard}>
              {category === 'moderate' && (
                <View style={[styles.tierRow, styles.tierActive, { borderBottomWidth: 0 }]}>
                  <View style={[styles.tierDot, { backgroundColor: COLORS.amber }]} />
                  <View style={styles.tierText}>
                    <Text style={styles.tierName}>Tier 1 — Light</Text>
                    <Text style={styles.tierDesc}>Breathing reset, 5 min</Text>
                  </View>
                  <Text style={styles.tierCheck}>✓</Text>
                </View>
              )}
              {category === 'high' && (
                <View style={[styles.tierRow, styles.tierActive, { borderBottomWidth: 0 }]}>
                  <View style={[styles.tierDot, { backgroundColor: COLORS.coral }]} />
                  <View style={styles.tierText}>
                    <Text style={styles.tierName}>Tier 2 — Guided</Text>
                    <Text style={styles.tierDesc}>Breathing + movement, 10 min</Text>
                  </View>
                  <Text style={styles.tierCheck}>✓</Text>
                </View>
              )}
              {category === 'very_high' && (
                <View style={[styles.tierRow, styles.tierActive, { borderBottomWidth: 0 }]}>
                  <View style={[styles.tierDot, { backgroundColor: '#B03020' }]} />
                  <View style={styles.tierText}>
                    <Text style={styles.tierName}>Tier 3 — Full Break</Text>
                    <Text style={styles.tierDesc}>Full disconnect, 15 min</Text>
                  </View>
                  <Text style={styles.tierCheck}>✓</Text>
                </View>
              )}
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.infoCard, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.infoLabel}>Duration</Text>
                <Text style={[styles.infoValue, { color: config.accentColor }]}>{config.durationLabel}</Text>
              </View>
              <View style={[styles.infoCard, { flex: 1 }]}>
                <Text style={styles.infoLabel}>Next opening</Text>
                <Text style={styles.infoValue}>{breakWindow}</Text>
              </View>
            </View>

            <View style={styles.tipsCard}>
              <Text style={styles.tipsHeader}>During your break:</Text>
              {config.tips.map((tip, i) => (
                <Text key={i} style={styles.tip}>· {tip}</Text>
              ))}
            </View>

            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: config.accentColor }]} onPress={handleStart} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>Start Break</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* TIER 1 — breathing only */}
            {category === 'moderate' && (
              <>
                <View style={styles.breathingSection}>
                  <Text style={styles.breathingTitle}>Box Breathing</Text>
                  <Text style={styles.breathingSubtitle}>Inhale 4s · Hold 4s · Exhale 4s · Hold 4s</Text>
                  <View style={styles.breathRingContainer}>
                    <Animated.View style={[styles.breathRingOuter, { borderColor: phaseColor, transform: [{ scale: breathScale }] }]}>
                      <View style={[styles.breathRingInner, { backgroundColor: phaseColor + '22' }]}>
                        <Text style={[styles.breathPhaseLabel, { color: phaseColor }]}>{phaseLabel}</Text>
                        <Text style={styles.breathPhaseSub}>4 seconds</Text>
                      </View>
                    </Animated.View>
                  </View>
                  <View style={styles.phaseRow}>
                    {BREATH_PHASES.map((p, i) => (
                      <View key={i} style={[styles.phaseDot, i === phaseIndex && styles.phaseDotActive]} />
                    ))}
                  </View>
                </View>
                <View style={styles.timerCard}>
                  <Text style={styles.timerLabel}>Time remaining</Text>
                  <Text style={[styles.timerValue, { color: config.accentColor }]}>{formatTime(secondsLeft)}</Text>
                  <Text style={styles.timerSub}>{paused ? 'Paused — take your time.' : 'Breathe and reset.'}</Text>
                </View>
              </>
            )}

            {/* TIER 2 — breathing + rotating tip */}
            {category === 'high' && (
              <>
                <View style={styles.breathingSection}>
                  <Text style={styles.breathingTitle}>Box Breathing</Text>
                  <Text style={styles.breathingSubtitle}>Inhale 4s · Hold 4s · Exhale 4s · Hold 4s</Text>
                  <View style={styles.breathRingContainer}>
                    <Animated.View style={[styles.breathRingOuter, { borderColor: phaseColor, transform: [{ scale: breathScale }] }]}>
                      <View style={[styles.breathRingInner, { backgroundColor: phaseColor + '22' }]}>
                        <Text style={[styles.breathPhaseLabel, { color: phaseColor }]}>{phaseLabel}</Text>
                        <Text style={styles.breathPhaseSub}>4 seconds</Text>
                      </View>
                    </Animated.View>
                  </View>
                  <View style={styles.phaseRow}>
                    {BREATH_PHASES.map((p, i) => (
                      <View key={i} style={[styles.phaseDot, i === phaseIndex && styles.phaseDotActive]} />
                    ))}
                  </View>
                </View>
                <View style={styles.rotatingTipCard}>
                  <Text style={styles.rotatingTipIcon}>{TIER2_ROTATING_TIPS[rotatingTipIndex].icon}</Text>
                  <Text style={styles.rotatingTipText}>{TIER2_ROTATING_TIPS[rotatingTipIndex].text}</Text>
                </View>
                <View style={styles.timerCard}>
                  <Text style={styles.timerLabel}>Time remaining</Text>
                  <Text style={[styles.timerValue, { color: config.accentColor }]}>{formatTime(secondsLeft)}</Text>
                  <Text style={styles.timerSub}>{paused ? 'Paused — take your time.' : 'Step away. You earned this.'}</Text>
                </View>
              </>
            )}

            {/* TIER 3 — disconnect + checklist */}
            {category === 'very_high' && (
              <>
                <View style={styles.disconnectCard}>
                  <Text style={styles.disconnectIcon}>🚫</Text>
                  <Text style={styles.disconnectTitle}>Full Disconnect Mode</Text>
                  <Text style={styles.disconnectSub}>Step away from everything. Tick off each item as you go.</Text>
                </View>
                <View style={styles.checklistCard}>
                  <Text style={styles.checklistHeader}>Recovery checklist</Text>
                  {TIER3_CHECKLIST.map((item, i) => (
                    <TouchableOpacity key={i} style={styles.checklistRow} onPress={() => toggleCheck(i)} activeOpacity={0.7}>
                      <View style={[styles.checkbox, checkedItems[i] && styles.checkboxChecked]}>
                        {checkedItems[i] && <Text style={styles.checkboxTick}>✓</Text>}
                      </View>
                      <Text style={styles.checklistIcon}>{item.icon}</Text>
                      <Text style={[styles.checklistText, checkedItems[i] && styles.checklistTextDone]}>{item.text}</Text>
                    </TouchableOpacity>
                  ))}
                  <Text style={styles.checklistProgress}>{checkedCount}/{TIER3_CHECKLIST.length} complete</Text>
                </View>
                <View style={styles.timerCard}>
                  <Text style={styles.timerLabel}>Time remaining</Text>
                  <Text style={[styles.timerValue, { color: config.accentColor }]}>{formatTime(secondsLeft)}</Text>
                  <Text style={styles.timerSub}>{paused ? 'Paused — take your time.' : 'Do not return until the timer ends.'}</Text>
                </View>
              </>
            )}

            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: paused ? COLORS.teal : COLORS.inkMid }]} onPress={handlePause} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>{paused ? 'Resume' : 'Pause'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: config.accentColor, marginTop: 0 }]} onPress={handleDoneEarly} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>I'm done — reflect now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: { paddingHorizontal: 24, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerEyebrow: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  tierBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
  tierBadgeText: { fontSize: 11, color: COLORS.white, fontWeight: '600' },
  scroll: { flex: 1, backgroundColor: COLORS.cream },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 48 },
  header: { fontSize: 28, fontWeight: '700', color: COLORS.ink, lineHeight: 36, marginBottom: 24 },
  tierCard: { backgroundColor: COLORS.white, borderRadius: 14, marginBottom: 16, borderWidth: 1, borderColor: '#E0DDD6', overflow: 'hidden' },
  tierRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#E0DDD6' },
  tierActive: { backgroundColor: COLORS.cream },
  tierDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  tierText: { flex: 1 },
  tierName: { fontSize: 14, fontWeight: '600', color: COLORS.ink },
  tierDesc: { fontSize: 12, color: COLORS.inkSoft, marginTop: 1 },
  tierCheck: { fontSize: 16, color: COLORS.teal, fontWeight: '700' },
  infoRow: { flexDirection: 'row', marginBottom: 16 },
  infoCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E0DDD6' },
  infoLabel: { fontSize: 11, color: COLORS.inkSoft, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '700', color: COLORS.ink },
  tipsCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E0DDD6' },
  tipsHeader: { fontSize: 11, color: COLORS.inkSoft, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  tip: { fontSize: 14, color: COLORS.inkMid, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#F0EDE6' },
  primaryButton: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  skipButton: { alignItems: 'center', paddingVertical: 12 },
  skipText: { fontSize: 14, color: COLORS.inkSoft },
  breathingSection: { alignItems: 'center', marginBottom: 24 },
  breathingTitle: { fontSize: 16, fontWeight: '700', color: COLORS.ink, marginBottom: 4 },
  breathingSubtitle: { fontSize: 12, color: COLORS.inkSoft, marginBottom: 28 },
  breathRingContainer: { width: 180, height: 180, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  breathRingOuter: { width: 160, height: 160, borderRadius: 80, borderWidth: 3, justifyContent: 'center', alignItems: 'center' },
  breathRingInner: { width: 130, height: 130, borderRadius: 65, justifyContent: 'center', alignItems: 'center' },
  breathPhaseLabel: { fontSize: 22, fontWeight: '700' },
  breathPhaseSub: { fontSize: 12, color: COLORS.inkSoft, marginTop: 2 },
  phaseRow: { flexDirection: 'row', gap: 8 },
  phaseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0DDD6' },
  phaseDotActive: { backgroundColor: COLORS.teal },
  timerCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 24, marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E0DDD6' },
  timerLabel: { fontSize: 11, color: COLORS.inkSoft, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
  timerValue: { fontSize: 52, fontWeight: '800', lineHeight: 60 },
  timerSub: { fontSize: 13, color: COLORS.inkSoft, marginTop: 6 },
  rotatingTipCard: { backgroundColor: COLORS.tealPale, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.teal + '44', flexDirection: 'row', alignItems: 'center', gap: 12 },
  rotatingTipIcon: { fontSize: 24 },
  rotatingTipText: { fontSize: 15, color: COLORS.inkMid, flex: 1, fontWeight: '500' },
  disconnectCard: { backgroundColor: COLORS.coralPale, borderRadius: 14, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.coral + '44', alignItems: 'center' },
  disconnectIcon: { fontSize: 36, marginBottom: 8 },
  disconnectTitle: { fontSize: 18, fontWeight: '700', color: COLORS.coral, marginBottom: 4 },
  disconnectSub: { fontSize: 13, color: COLORS.inkMid, textAlign: 'center', lineHeight: 20 },
  checklistCard: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E0DDD6' },
  checklistHeader: { fontSize: 11, color: COLORS.inkSoft, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 },
  checklistRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0EDE6', gap: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#D0CCC4', justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: COLORS.sage, borderColor: COLORS.sage },
  checkboxTick: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
  checklistIcon: { fontSize: 16 },
  checklistText: { fontSize: 14, color: COLORS.inkMid, flex: 1 },
  checklistTextDone: { textDecorationLine: 'line-through', color: COLORS.inkSoft },
  checklistProgress: { fontSize: 12, color: COLORS.inkSoft, marginTop: 10, textAlign: 'right' },
});