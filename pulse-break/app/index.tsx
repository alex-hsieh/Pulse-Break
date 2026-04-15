import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { saveCheckIn } from '../utils/storage';
import { COLORS, FONTS } from '../utils/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import encouragementData from '../content/encouragement-prompts.json';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from 'react-native';

const EMOJI_SCALE = [
  { level: 1, emoji: '😌', label: 'Calm' },
  { level: 2, emoji: '🙂', label: 'Okay' },
  { level: 3, emoji: '😐', label: 'Mild' },
  { level: 4, emoji: '😟', label: 'Stressed' },
  { level: 5, emoji: '😰', label: 'Very Stressed' },
];

const ENCOURAGEMENTS: string[] = (encouragementData as { encouragements: string[] }).encouragements;

const MOCK_FORECAST = [
  { time: '9 AM',  label: 'Team standup',    pct: 28, color: '#7A9E7E' },
  { time: '11 AM', label: 'Deep work block', pct: 35, color: '#7A9E7E' },
  { time: '1 PM',  label: 'Lunch / recharge',pct: 20, color: '#7A9E7E' },
  { time: '2 PM',  label: 'Sprint review',   pct: 62, color: COLORS.tealDeep },
  { time: '4 PM',  label: 'Deadline crunch', pct: 85, color: COLORS.sageDeep },
];

function getDailyEncouragement(): string {
  const today = new Date();
  const dayIndex = today.getFullYear() * 1000 + today.getMonth() * 31 + today.getDate();
  return ENCOURAGEMENTS[dayIndex % ENCOURAGEMENTS.length];
}

function evaluateStress(level: number): 'low' | 'moderate' | 'high' | 'very_high' {
  if (level <= 2) return 'low';
  if (level === 3) return 'moderate';
  if (level === 4) return 'high';
  return 'very_high';
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    reset?: string;
    breakDuration?: string;
    reflectionType?: string;
  }>();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [stressCategory, setStressCategory] = useState<'low' | 'moderate' | 'high' | 'very_high' | null>(null);
  const [showResetBanner, setShowResetBanner] = useState(false);
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.45)).current;

  const encouragement = getDailyEncouragement();

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.12,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0.18,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.45,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [pulseOpacity, pulseScale]);

  useFocusEffect(
    useCallback(() => {
      setSelected(null);
      setNotes('');
      setConfirmed(false);
      setStressCategory(null);
      setShowResetBanner(params.reset === '1');
    }, [params.reset])
  );

  const handleSelect = (level: number) => {
    setSelected(level);
    setConfirmed(false);
    setShowResetBanner(false);
  };

  const handleSubmit = async () => {
    if (!selected) return;
    const category = evaluateStress(selected);
    setStressCategory(category);
    const checkInId = Date.now().toString(36) + Math.random().toString(36).slice(2);
    saveCheckIn(selected, notes || undefined, checkInId).catch(console.error);
    setConfirmed(true);
    if (category === 'high' || category === 'very_high' || category === 'moderate') {
      setTimeout(() => {
        router.push({ pathname: '/break', params: { checkInId, stressCategory: category } } as any);
      }, 2000);
    } else {
      setTimeout(() => {
        setSelected(null);
        setNotes('');
        setConfirmed(false);
      }, 2000);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <View style={[styles.headerBar, { paddingTop: insets.top + 14 }]}>
            <View>
              <Text style={styles.appName}>Pulse Break</Text>
              <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>
            </View>
            <View style={styles.stressIndicator}>
              <Text style={styles.stressIndicatorLabel}>Today</Text>
              <View style={styles.stressBarMini}>
                <View style={[styles.stressBarFill, { width: '30%' }]} />
              </View>
              <Text style={styles.stressIndicatorValue}>Low</Text>
            </View>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View style={styles.heroCard}>
              <View style={styles.heroCopy}>
                <Text style={styles.heroEyebrow}>Reset with intention</Text>
                <Text style={styles.heroTitle}>Pause. Reset. Move forward with clarity.</Text>
                <Text style={styles.heroText}>
                  Check in, take a guided pulse break, and come back grounded before stress takes over your day.
                </Text>
                <View style={styles.heroTags}>
                  <View style={styles.heroTag}>
                    <Text style={styles.heroTagText}>Pulse check</Text>
                  </View>
                  <View style={styles.heroTag}>
                    <Text style={styles.heroTagText}>Journal</Text>
                  </View>
                  <View style={styles.heroTag}>
                    <Text style={styles.heroTagText}>Reflect</Text>
                  </View>
                </View>
              </View>
              <View style={styles.heroVisual}>
                <Animated.View
                  style={[
                    styles.pulseHalo,
                    {
                      opacity: pulseOpacity,
                      transform: [{ scale: pulseScale }],
                    },
                  ]}
                />
                <View style={styles.pulseCore}>
                  <Text style={styles.pulseIcon}>🫀</Text>
                  <Text style={styles.pulseLabel}>Pulse Break</Text>
                </View>
              </View>
            </View>

            {showResetBanner && (
              <View style={styles.resetBanner}>
                <Text style={styles.resetBannerTitle}>Pulse break complete</Text>
                <Text style={styles.resetBannerText}>
                  {params.reflectionType === 'controllable'
                    ? `You reset and identified a next step${params.breakDuration ? ` after ${params.breakDuration} seconds` : ''}.`
                    : `You reset and released what was not yours to carry${params.breakDuration ? ` after ${params.breakDuration} seconds` : ''}.`}
                </Text>
              </View>
            )}

            <View style={styles.forecastCard}>
              <Text style={styles.forecastTitle}>Stress Forecast — Today</Text>
              {MOCK_FORECAST.map((item) => (
                <View key={item.time} style={styles.forecastRow}>
                  <Text style={styles.forecastTime}>{item.time}</Text>
                  <View style={styles.forecastBarBg}>
                    <View style={[styles.forecastBarFill, { width: `${item.pct}%`, backgroundColor: item.color }]} />
                  </View>
                  <Text style={styles.forecastLabel}>{item.label}</Text>
                </View>
              ))}
              <Text style={styles.forecastNote}>Based on your calendar · Azure ML vision</Text>
            </View>

            <Text style={styles.header}>How are you feeling?</Text>

            <View style={styles.emojiRow}>
              {EMOJI_SCALE.map(({ level, emoji, label }) => {
                const isSelected = selected === level;
                return (
                  <TouchableOpacity
                    key={level}
                    style={[styles.emojiButton, isSelected && styles.emojiSelected]}
                    onPress={() => handleSelect(level)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.emoji}>{emoji}</Text>
                    <Text style={[styles.emojiLabel, isSelected && styles.emojiLabelSelected]}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selected && !confirmed && (
              <View style={styles.notesWrapper}>
                <TextInput
                  style={styles.notesInput}
                  placeholder="What's on your mind? (optional)"
                  placeholderTextColor={COLORS.inkSoft}
                  value={notes}
                  onChangeText={setNotes}
                  maxLength={200}
                  multiline
                />
                <Text style={styles.charCount}>{notes.length}/200</Text>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitText}>Log Check-In</Text>
                </TouchableOpacity>
                <Text style={styles.quote}>"{encouragement}"</Text>
              </View>
            )}

            {confirmed && stressCategory && (
              <View style={[
                styles.confirmation,
                (stressCategory === 'high' || stressCategory === 'very_high') && styles.confirmationHigh,
                stressCategory === 'moderate' && styles.confirmationModerate,
              ]}>
                <Text style={[
                  styles.confirmationText,
                  (stressCategory === 'high' || stressCategory === 'very_high') && styles.confirmationTextHigh,
                  stressCategory === 'moderate' && styles.confirmationTextModerate,
                ]}>
                  {stressCategory === 'low' && "You're doing great. Keep it up!"}
                  {stressCategory === 'moderate' && "Feeling the pressure. A short break could help."}
                  {stressCategory === 'high' && "Stress detected. Let's take a break."}
                  {stressCategory === 'very_high' && "High stress detected. You need a break now."}
                </Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.teal },
  headerBar: {
    backgroundColor: COLORS.sage,
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: { fontSize: 11, fontFamily: FONTS.semibold, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 2 },
  greeting: { fontSize: 20, fontFamily: FONTS.semibold, color: COLORS.white },
  stressIndicator: { alignItems: 'flex-end', gap: 4 },
  stressIndicatorLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.8 },
  stressBarMini: { width: 80, height: 5, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 99, overflow: 'hidden' },
  stressBarFill: { height: '100%', backgroundColor: COLORS.white, borderRadius: 99 },
  stressIndicatorValue: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  scroll: { flex: 1, backgroundColor: COLORS.cream },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.line,
    overflow: 'hidden',
  },
  heroCopy: { marginBottom: 18 },
  heroEyebrow: {
    fontSize: 11,
    fontFamily: FONTS.semibold,
    color: COLORS.tealDeep,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: FONTS.bold,
    color: COLORS.ink,
    marginBottom: 10,
  },
  heroText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.inkMid,
    marginBottom: 14,
  },
  heroTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  heroTag: {
    backgroundColor: COLORS.tealPale,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  heroTagText: {
    fontSize: 12,
    fontFamily: FONTS.semibold,
    color: COLORS.tealDeep,
  },
  heroVisual: {
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseHalo: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.teal,
  },
  pulseCore: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: COLORS.sagePale,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseIcon: { fontSize: 34, marginBottom: 4 },
  pulseLabel: {
    fontSize: 12,
    fontFamily: FONTS.semibold,
    color: COLORS.tealDeep,
  },
  resetBanner: {
    backgroundColor: COLORS.sagePale,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.sage,
  },
  resetBannerTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.sageDeep,
    marginBottom: 4,
  },
  resetBannerText: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.inkMid,
  },
  forecastCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 28, borderWidth: 1, borderColor: '#E0DDD6' },
  forecastTitle: { fontSize: 11, fontFamily: FONTS.semibold, color: COLORS.inkSoft, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 },
  forecastRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  forecastTime: { fontSize: 11, color: COLORS.inkSoft, width: 36 },
  forecastBarBg: { width: 100, height: 6, backgroundColor: '#E0DDD6', borderRadius: 99, overflow: 'hidden' },
  forecastBarFill: { height: '100%', borderRadius: 99 },
  forecastLabel: { fontSize: 12, color: COLORS.inkMid, flex: 1 },
  forecastNote: { fontSize: 10, color: COLORS.inkSoft, fontStyle: 'italic', marginTop: 8, textAlign: 'right' },
  header: { fontSize: 26, fontFamily: FONTS.bold, color: COLORS.ink, marginBottom: 16 },
  emojiRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  emojiButton: { alignItems: 'center', padding: 6, borderRadius: 12, flex: 1, marginHorizontal: 2, height: 80, justifyContent: 'center' },
  emojiSelected: { backgroundColor: COLORS.sage + '33', borderWidth: 1.5, borderColor: COLORS.sage },
  emoji: { fontSize: 32, marginBottom: 4 },
  emojiLabel: { fontSize: 9, color: COLORS.inkSoft, textAlign: 'center' },
  emojiLabelSelected: { color: COLORS.sageDeep, fontFamily: FONTS.semibold },
  notesWrapper: { marginTop: 8 },
  notesInput: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, fontSize: 15, color: COLORS.ink, minHeight: 80, textAlignVertical: 'top', borderWidth: 1, borderColor: '#E0DDD6' },
  charCount: { fontSize: 12, color: COLORS.inkSoft, textAlign: 'right', marginTop: 4, marginBottom: 16 },
  submitButton: { backgroundColor: COLORS.teal, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  submitText: { color: COLORS.white, fontSize: 16, fontFamily: FONTS.semibold },
  quote: { marginTop: 20, fontSize: 14, fontStyle: 'italic', color: COLORS.inkSoft, textAlign: 'center', lineHeight: 22, paddingHorizontal: 8 },
  confirmation: { backgroundColor: COLORS.sage + '22', borderRadius: 12, padding: 20, alignItems: 'center', marginTop: 16, borderWidth: 1, borderColor: COLORS.sage },
  confirmationText: { fontSize: 16, color: COLORS.sageDeep, fontFamily: FONTS.semibold },
  confirmationHigh: { backgroundColor: '#D4715A22', borderColor: '#D4715A' },
  confirmationTextHigh: { color: '#D4715A' },
  confirmationModerate: { backgroundColor: '#D4A05522', borderColor: '#D4A055' },
  confirmationTextModerate: { color: '#D4A055' },
});
