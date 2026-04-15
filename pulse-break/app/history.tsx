import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import {
  getWeeklyCheckIns,
  getWeeklyControlRatio,
  getWeeklyWellnessScore,
  CheckIn,
  ControlRatio,
  WellnessScore,
} from '../utils/storage';
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from '../utils/theme';

const EMOJI_MAP: Record<number, string> = { 1: '😌', 2: '🙂', 3: '😐', 4: '😟', 5: '😰' };
const LABEL_MAP: Record<number, string> = { 1: 'Calm', 2: 'Okay', 3: 'Mild', 4: 'Stressed', 5: 'Very Stressed' };
const LEVEL_COLOR: Record<number, string> = { 1: COLORS.sage, 2: COLORS.sage, 3: COLORS.tealDeep, 4: COLORS.tealDeep, 5: COLORS.tealDeep };

const LABEL_COLOR: Record<WellnessScore['label'], string> = {
  Building: COLORS.sageDeep,
  Steady: COLORS.sage,
  Thriving: COLORS.tealDeep,
  Excellent: COLORS.tealDeep,
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function HistoryScreen() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [highCount, setHighCount] = useState(0);
  const [ratio, setRatio] = useState<ControlRatio | null>(null);
  const [wellness, setWellness] = useState<WellnessScore | null>(null);

  useFocusEffect(
    useCallback(() => {
      getWeeklyCheckIns().then(data => {
        setCheckIns(data);
        setHighCount(data.filter(c => c.stressLevel >= 4).length);
      });
      getWeeklyControlRatio().then(setRatio);
      getWeeklyWellnessScore().then(setWellness);
    }, [])
  );

  const renderItem = ({ item }: { item: CheckIn }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardEmoji}>{EMOJI_MAP[item.stressLevel]}</Text>
      </View>
      <View style={styles.cardMiddle}>
        <Text style={[styles.cardLabel, { color: LEVEL_COLOR[item.stressLevel] }]}>{LABEL_MAP[item.stressLevel]}</Text>
        {item.notes ? <Text style={styles.cardNotes} numberOfLines={1}>{item.notes}</Text> : null}
        <Text style={styles.cardDate}>{formatDate(item.timestamp)} · {formatTime(item.timestamp)}</Text>
      </View>
      <View style={[styles.cardDot, { backgroundColor: LEVEL_COLOR[item.stressLevel] }]} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Weekly view</Text>
          <Text style={styles.header}>Your stress patterns this week</Text>
          <Text style={styles.subheader}>
            Review your check-ins, spot the high-stress moments, and track what you can control.
          </Text>
        </View>

        {wellness && checkIns.length > 0 && (
          <View style={styles.wellnessCard}>
            <View style={styles.wellnessLeft}>
              <Text style={styles.wellnessTitle}>Wellness Score</Text>
              <Text style={[styles.wellnessLabel, { color: LABEL_COLOR[wellness.label] }]}>
                {wellness.label}
              </Text>
            </View>
            <Text style={[styles.wellnessScore, { color: LABEL_COLOR[wellness.label] }]}>
              {wellness.score}
            </Text>
          </View>
        )}

        {checkIns.length > 0 && (
          <View style={styles.statsBar}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{checkIns.length}</Text>
              <Text style={styles.statLabel}>Check-ins</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: COLORS.coral }]}>{highCount}</Text>
              <Text style={styles.statLabel}>High stress</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: COLORS.sage }]}>{checkIns.length - highCount}</Text>
              <Text style={styles.statLabel}>Low/moderate</Text>
            </View>
          </View>
        )}

        {ratio && ratio.total > 0 && (
          <View style={styles.ratioCard}>
            <Text style={styles.ratioTitle}>Let Them Breakdown</Text>
            <View style={styles.ratioRow}>
              <View style={styles.ratioStat}>
                <Text style={[styles.ratioValue, { color: COLORS.teal }]}>{ratio.controllable}</Text>
                <Text style={styles.ratioLabel}>I can act</Text>
              </View>
              <View style={styles.ratioBar}>
                <View style={[styles.ratioFill, { flex: ratio.controllable, backgroundColor: COLORS.teal }]} />
                <View style={[styles.ratioFill, { flex: ratio.uncontrollable, backgroundColor: COLORS.sage }]} />
              </View>
              <View style={styles.ratioStat}>
                <Text style={[styles.ratioValue, { color: COLORS.sage }]}>{ratio.uncontrollable}</Text>
                <Text style={styles.ratioLabel}>Let them</Text>
              </View>
            </View>
          </View>
        )}

        <FlatList
          data={checkIns}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={checkIns.length === 0 && styles.emptyContainer}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No check-ins yet.</Text>
              <Text style={styles.emptySubtext}>Log your first one!</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  inner: { flex: 1, paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg },
  heroCard: {
    backgroundColor: COLORS.paper,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginBottom: SPACING.lg,
    ...SHADOW,
  },
  eyebrow: { fontSize: 12, color: COLORS.tealDeep, fontFamily: FONTS.semibold, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  header: { fontSize: 31, fontFamily: FONTS.bold, color: COLORS.ink, lineHeight: 38, marginBottom: 10 },
  subheader: { fontSize: 15, color: COLORS.inkSoft, lineHeight: 22 },
  wellnessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  wellnessLeft: { flexDirection: 'column' },
  wellnessTitle: { fontSize: 12, color: COLORS.inkSoft, fontFamily: FONTS.semibold, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 },
  wellnessLabel: { fontSize: 18, fontFamily: FONTS.bold },
  wellnessScore: { fontSize: 48, fontFamily: FONTS.bold, lineHeight: 52 },
  statsBar: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.line },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontFamily: FONTS.bold, color: COLORS.ink },
  statLabel: { fontSize: 11, color: COLORS.inkSoft, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: COLORS.line },
  ratioCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.line },
  ratioTitle: { fontSize: 12, color: COLORS.inkSoft, fontFamily: FONTS.semibold, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  ratioRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ratioStat: { alignItems: 'center', minWidth: 44 },
  ratioValue: { fontSize: 18, fontFamily: FONTS.bold },
  ratioLabel: { fontSize: 10, color: COLORS.inkSoft, marginTop: 2 },
  ratioBar: { flex: 1, height: 8, borderRadius: 4, flexDirection: 'row', overflow: 'hidden', backgroundColor: COLORS.line },
  ratioFill: { height: '100%' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.line },
  cardLeft: { marginRight: 12 },
  cardEmoji: { fontSize: 28 },
  cardMiddle: { flex: 1 },
  cardLabel: { fontSize: 15, fontFamily: FONTS.semibold, marginBottom: 2 },
  cardNotes: { fontSize: 13, color: COLORS.inkSoft, marginBottom: 2 },
  cardDate: { fontSize: 12, color: COLORS.inkSoft },
  cardDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
  emptyContainer: { flex: 1 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 18, fontFamily: FONTS.semibold, color: COLORS.ink, marginBottom: 4 },
  emptySubtext: { fontSize: 15, color: COLORS.inkSoft },
});
