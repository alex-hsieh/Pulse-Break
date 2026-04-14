import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const COLORS = {
  sage: '#7A9E7E',
  teal: '#3D8B8B',
  coral: '#D4715A',
  cream: '#F8F5EF',
  dark: '#2D3142',
  gray: '#9A9CB0',
  white: '#FFFFFF',
};

function getNextBreakWindow(): string {
  const now = new Date();
  const remainder = 15 - (now.getMinutes() % 15);
  const start = new Date(now.getTime() + remainder * 60000);
  const end = new Date(start.getTime() + 15 * 60000);
  const fmt = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${fmt(start)} — ${fmt(end)}`;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function BreakScreen() {
  const router = useRouter();
  const { checkInId, stressCategory } = useLocalSearchParams<{ checkInId: string; stressCategory: string }>();
  const isVeryHigh = stressCategory === 'very_high';
  const breakWindow = getNextBreakWindow();

  const defaultSeconds = isVeryHigh ? 15 * 60 : 10 * 60;
  const [timerActive, setTimerActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(defaultSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerActive && !paused) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            router.push({ pathname: '/reflection', params: { checkInId } } as any);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerActive, paused]);

  const handleStart = () => {
    setTimerActive(true);
    setPaused(false);
  };

  const handlePause = () => setPaused(p => !p);

  const handleSkip = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    router.push('/' as any);
  };

  const handleDoneEarly = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    router.push({ pathname: '/reflection', params: { checkInId } } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>

        <View style={styles.accent} />
        <Text style={styles.eyebrow}>{isVeryHigh ? 'Urgent' : 'High stress detected'}</Text>
        <Text style={styles.header}>
          {isVeryHigh ? 'You need a break\nright now.' : "Let's take a quick\nbreak to reset."}
        </Text>

        {!timerActive ? (
          <>
            <View style={styles.durationCard}>
              <Text style={styles.durationLabel}>Recommended duration</Text>
              <Text style={styles.durationValue}>{isVeryHigh ? '15 minutes' : '10 minutes'}</Text>
            </View>

            <View style={styles.calendarCard}>
              <Text style={styles.calendarLabel}>Next opening</Text>
              <Text style={styles.calendarValue}>{breakWindow}</Text>
            </View>

            <View style={styles.tipsWrapper}>
              <Text style={styles.tipsHeader}>During your break, try:</Text>
              <Text style={styles.tip}>Step away from your screen</Text>
              <Text style={styles.tip}>Take 5 slow, deep breaths</Text>
              <Text style={styles.tip}>Drink a glass of water</Text>
              <Text style={styles.tip}>Take a short walk</Text>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.8}>
              <Text style={styles.startButtonText}>Start Break</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.timerCard}>
              <Text style={styles.timerLabel}>Time remaining</Text>
              <Text style={styles.timerValue}>{formatTime(secondsLeft)}</Text>
              <Text style={styles.timerSub}>
                {paused ? 'Paused — take your time.' : 'Step away. You earned this.'}
              </Text>
            </View>

            <View style={styles.tipsWrapper}>
              <Text style={styles.tipsHeader}>While you rest:</Text>
              <Text style={styles.tip}>Step away from your screen</Text>
              <Text style={styles.tip}>Take 5 slow, deep breaths</Text>
              <Text style={styles.tip}>Drink a glass of water</Text>
              <Text style={styles.tip}>Take a short walk</Text>
            </View>

            <TouchableOpacity
              style={[styles.startButton, paused && styles.resumeButton]}
              onPress={handlePause}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>{paused ? 'Resume' : 'Pause'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.doneEarlyButton} onPress={handleDoneEarly} activeOpacity={0.8}>
              <Text style={styles.doneEarlyText}>I'm done — reflect now</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: 40 },
  accent: { width: 48, height: 5, borderRadius: 99, backgroundColor: COLORS.coral, marginBottom: 24 },
  eyebrow: { fontSize: 13, color: COLORS.coral, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  header: { fontSize: 30, fontWeight: '700', color: COLORS.dark, lineHeight: 38, marginBottom: 32 },
  durationCard: { backgroundColor: COLORS.teal + '18', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.teal + '44' },
  durationLabel: { fontSize: 12, color: COLORS.teal, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  durationValue: { fontSize: 22, fontWeight: '700', color: COLORS.teal },
  calendarCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E0DDD6' },
  calendarLabel: { fontSize: 12, color: COLORS.gray, marginBottom: 4 },
  calendarValue: { fontSize: 16, fontWeight: '600', color: COLORS.dark },
  tipsWrapper: { marginBottom: 32 },
  tipsHeader: { fontSize: 13, color: COLORS.gray, fontWeight: '600', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  tip: { fontSize: 15, color: COLORS.dark, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#E0DDD6' },
  timerCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 28, marginBottom: 24, alignItems: 'center', borderWidth: 1, borderColor: '#E0DDD6' },
  timerLabel: { fontSize: 12, color: COLORS.gray, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  timerValue: { fontSize: 56, fontWeight: '800', color: COLORS.teal, lineHeight: 64 },
  timerSub: { fontSize: 13, color: COLORS.gray, marginTop: 8 },
  startButton: { backgroundColor: COLORS.coral, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  resumeButton: { backgroundColor: COLORS.teal },
  startButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  doneEarlyButton: { backgroundColor: COLORS.dark, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  doneEarlyText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  skipButton: { alignItems: 'center', paddingVertical: 12 },
  skipText: { fontSize: 14, color: COLORS.gray },
});