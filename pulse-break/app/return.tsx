import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, ScrollView } from 'react-native';
import { COLORS, FONTS } from '../utils/theme';

const STRESS_DROP: Record<string, { before: number; after: number }> = {
  moderate:  { before: 55, after: 22 },
  high:      { before: 75, after: 28 },
  very_high: { before: 85, after: 24 },
};

const DURATION_LABEL: Record<string, string> = {
  moderate:  '5 min',
  high:      '10 min',
  very_high: '15 min',
};

export default function ReturnScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stressCategory, reflectionType } = useLocalSearchParams<{
    stressCategory: string;
    reflectionType: string;
  }>();

  const category = stressCategory ?? 'high';
  const drop = STRESS_DROP[category] ?? STRESS_DROP.high;
  const duration = DURATION_LABEL[category] ?? '10 min';
  const scoreDrop = drop.before - drop.after;

  const ringAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(ringAnim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);

  const ringColor = drop.after <= 30 ? COLORS.sage : COLORS.coral;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.headerBar, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerCheck}>✅</Text>
        <View>
          <Text style={styles.headerTitle}>You're Back on Track</Text>
          <Text style={styles.headerSub}>Stress normalized — great job!</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.ringSection}>
          <View style={styles.ringWrap}>
            <View style={[styles.ringOuter, { borderColor: ringColor }]}>
              <View style={styles.ringInner}>
                <Text style={[styles.ringValue, { color: ringColor }]}>{drop.after}%</Text>
                <Text style={styles.ringLabel}>stress score</Text>
              </View>
            </View>
          </View>
          <Text style={styles.ringCaption}>Down from {drop.before}% before your break</Text>
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
            <Text style={[styles.statValue, { color: COLORS.sage }]}>✔</Text>
            <Text style={styles.statLabel}>Reflected</Text>
          </View>
        </View>

        <View style={styles.mlCard}>
          <Text style={styles.mlTitle}>🔁 Azure ML Learning</Text>
          <Text style={styles.mlText}>
            {reflectionType === 'controllable'
              ? 'You identified an actionable stressor. Box breathing helped you reset. Logged for future interventions.'
              : 'You chose to let this one go. Box breathing helped you reset. Logged for future interventions.'}
          </Text>
        </View>

        <View style={styles.recapCard}>
          <Text style={styles.recapTitle}>What helped</Text>
          <View style={styles.recapRow}>
            <Text style={styles.recapIcon}>🌬</Text>
            <Text style={styles.recapText}>Box breathing — 4s inhale, hold, exhale, hold</Text>
          </View>
          <View style={styles.recapRow}>
            <Text style={styles.recapIcon}>💭</Text>
            <Text style={styles.recapText}>Let Them reflection — awareness of what you control</Text>
          </View>
          <View style={styles.recapRow}>
            <Text style={styles.recapIcon}>📊</Text>
            <Text style={styles.recapText}>Check-in logged to your weekly wellness score</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/' as any)} activeOpacity={0.8}>
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
  headerTitle: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  scroll: { flex: 1, backgroundColor: COLORS.cream },
  scrollContent: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 48 },
  ringSection: { alignItems: 'center', marginBottom: 24 },
  ringWrap: { marginBottom: 8 },
  ringOuter: { width: 140, height: 140, borderRadius: 70, borderWidth: 6, justifyContent: 'center', alignItems: 'center' },
  ringInner: { alignItems: 'center' },
  ringValue: { fontSize: 36, fontFamily: FONTS.bold },
  ringLabel: { fontSize: 12, color: COLORS.inkSoft, marginTop: 2 },
  ringCaption: { fontSize: 13, color: COLORS.inkSoft, textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E0DDD6' },
  statValue: { fontSize: 22, fontFamily: FONTS.bold, marginBottom: 4 },
  statLabel: { fontSize: 11, color: COLORS.inkSoft, textAlign: 'center' },
  mlCard: { backgroundColor: COLORS.tealPale, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.teal + '44' },
  mlTitle: { fontSize: 13, fontFamily: FONTS.bold, color: COLORS.tealDeep, marginBottom: 6 },
  mlText: { fontSize: 14, color: COLORS.inkMid, lineHeight: 21 },
  recapCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E0DDD6' },
  recapTitle: { fontSize: 11, color: COLORS.inkSoft, fontFamily: FONTS.semibold, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 },
  recapRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  recapIcon: { fontSize: 16, marginTop: 1 },
  recapText: { fontSize: 14, color: COLORS.inkMid, flex: 1, lineHeight: 20 },
  ctaButton: { backgroundColor: COLORS.ink, borderRadius: 12, paddingVertical: 18, alignItems: 'center' },
  ctaText: { color: COLORS.white, fontSize: 16, fontFamily: FONTS.bold },
});
