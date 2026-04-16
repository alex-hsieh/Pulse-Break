import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, ScrollView } from 'react-native';

const COLORS = {
  sage: '#7A9E7E',
  sagePale: '#EAF2EB',
  teal: '#3D8B8B',
  tealPale: '#E4F2F2',
  coral: '#D4715A',
  cream: '#F8F5EF',
  ink: '#1C2B2B',
  inkMid: '#3D5050',
  inkSoft: '#7A9090',
  white: '#FDFCFA',
};

type Activity = { icon: string; text: string };

const TIER_CONFIG: Record<string, {
  tierLabel: string;
  before: number;
  after: number;
  defaultDuration: number;
  primaryActivity: string;
  activities: Activity[];
}> = {
  moderate: {
    tierLabel: 'Tier 1 — Light',
    before: 55,
    after: 22,
    defaultDuration: 5 * 60,
    primaryActivity: 'Box breathing',
    activities: [
      { icon: '🌬', text: 'Box breathing — 4s inhale, hold, exhale, hold' },
      { icon: '💭', text: 'Let Them reflection — awareness of what you control' },
      { icon: '📊', text: 'Check-in logged to your weekly wellness score' },
    ],
  },
  high: {
    tierLabel: 'Tier 2 — Guided',
    before: 75,
    after: 28,
    defaultDuration: 10 * 60,
    primaryActivity: 'Box breathing + movement',
    activities: [
      { icon: '🌬', text: 'Box breathing — 4s inhale, hold, exhale, hold' },
      { icon: '🚶', text: 'Movement break — stepped away to recharge' },
      { icon: '💭', text: 'Let Them reflection — awareness of what you control' },
      { icon: '📊', text: 'Check-in logged to your weekly wellness score' },
    ],
  },
  very_high: {
    tierLabel: 'Tier 3 — Full Break',
    before: 85,
    after: 24,
    defaultDuration: 15 * 60,
    primaryActivity: 'Full disconnect',
    activities: [
      { icon: '🚫', text: 'Full disconnect — stepped away from all screens' },
      { icon: '🌬', text: 'Box breathing — 4s inhale, hold, exhale, hold' },
      { icon: '💧', text: 'Hydrated and moved away from desk' },
      { icon: '💭', text: 'Let Them reflection — awareness of what you control' },
      { icon: '📊', text: 'Check-in logged to your weekly wellness score' },
    ],
  },
};

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) return `${mins} min`;
  return `${mins}m ${secs}s`;
}

export default function ReturnScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stressCategory, breakDuration, reflectionType } = useLocalSearchParams<{
    stressCategory: string;
    breakDuration: string;
    reflectionType: string;
  }>();

  const category = (stressCategory in TIER_CONFIG ? stressCategory : 'high') as keyof typeof TIER_CONFIG;
  const config = TIER_CONFIG[category];
  const scoreDrop = config.before - config.after;

  const actualSeconds = breakDuration ? parseInt(breakDuration, 10) : config.defaultDuration;
  const duration = formatDuration(isNaN(actualSeconds) ? config.defaultDuration : actualSeconds);

  const reflectionLabel = reflectionType === 'controllable' ? 'Act' : 'Let Go';

  const ringAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(ringAnim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);

  const ringColor = config.after <= 30 ? COLORS.sage : COLORS.coral;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.headerBar, { paddingTop: insets.top - 44 }]}>
        <Text style={styles.headerCheck}>✅</Text>
        <View>
          <Text style={styles.headerTitle}>You're Back on Track</Text>
          <Text style={styles.headerSub}>{config.tierLabel} complete — great job!</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.ringSection}>
          <View style={styles.ringWrap}>
            <View style={[styles.ringOuter, { borderColor: ringColor }]}>
              <View style={styles.ringInner}>
                <Text style={[styles.ringValue, { color: ringColor }]}>{config.after}%</Text>
                <Text style={styles.ringLabel}>stress score</Text>
              </View>
            </View>
          </View>
          <Text style={styles.ringCaption}>Down from {config.before}% before your break</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: COLORS.teal }]}>{duration}</Text>
            <Text style={styles.statLabel}>Break taken</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: COLORS.sage }]}>{scoreDrop}pt</Text>
            <Text style={styles.statLabel}>Score drop</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: COLORS.sage }]}>{reflectionLabel}</Text>
            <Text style={styles.statLabel}>Reflected</Text>
          </View>
        </View>

        <View style={styles.mlCard}>
          <Text style={styles.mlTitle}>🔁 Azure ML Learning</Text>
          <Text style={styles.mlText}>
            {reflectionType === 'controllable'
              ? `You identified an actionable stressor. ${config.primaryActivity} helped you reset. Logged for future interventions.`
              : `You chose to let this one go. ${config.primaryActivity} helped you reset. Logged for future interventions.`}
          </Text>
        </View>

        <View style={styles.recapCard}>
          <Text style={styles.recapTitle}>What helped</Text>
          {config.activities.map((activity, i) => (
            <View key={i} style={styles.recapRow}>
              <Text style={styles.recapIcon}>{activity.icon}</Text>
              <Text style={styles.recapText}>{activity.text}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/check_in')} activeOpacity={0.8}>
          <Text style={styles.ctaText}>Return to Work — You've Got This</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.teal },
  headerBar: {
    backgroundColor: COLORS.teal,
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerCheck: { fontSize: 28 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  scroll: { flex: 1, backgroundColor: COLORS.cream },
  scrollContent: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 48 },
  ringSection: { alignItems: 'center', marginBottom: 24 },
  ringWrap: { marginBottom: 8 },
  ringOuter: { width: 140, height: 140, borderRadius: 70, borderWidth: 6, justifyContent: 'center', alignItems: 'center' },
  ringInner: { alignItems: 'center' },
  ringValue: { fontSize: 36, fontWeight: '800' },
  ringLabel: { fontSize: 12, color: COLORS.inkSoft, marginTop: 2 },
  ringCaption: { fontSize: 13, color: COLORS.inkSoft, textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E0DDD6' },
  statValue: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 11, color: COLORS.inkSoft, textAlign: 'center' },
  mlCard: { backgroundColor: COLORS.tealPale, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.teal + '44' },
  mlTitle: { fontSize: 13, fontWeight: '700', color: COLORS.teal, marginBottom: 6 },
  mlText: { fontSize: 14, color: COLORS.inkMid, lineHeight: 21 },
  recapCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E0DDD6' },
  recapTitle: { fontSize: 11, color: COLORS.inkSoft, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 },
  recapRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  recapIcon: { fontSize: 16, marginTop: 1 },
  recapText: { fontSize: 14, color: COLORS.inkMid, flex: 1, lineHeight: 20 },
  ctaButton: { backgroundColor: COLORS.ink, borderRadius: 12, paddingVertical: 18, alignItems: 'center' },
  ctaText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});