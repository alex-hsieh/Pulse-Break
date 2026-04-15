import React, { useState, useCallback } from 'react';
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
  { time: '9 AM', label: 'Team standup', pct: 28, color: COLORS.sage },
  { time: '11 AM', label: 'Deep work block', pct: 35, color: COLORS.sage },
  { time: '1 PM', label: 'Lunch / recharge', pct: 20, color: COLORS.sage },
  { time: '2 PM', label: 'Sprint review', pct: 62, color: COLORS.tealDeep },
  { time: '4 PM', label: 'Deadline crunch', pct: 85, color: COLORS.sageDeep },
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

export default function CheckInScreen() {
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

  const encouragement = getDailyEncouragement();

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
      }, 1600);
    } else {
      setTimeout(() => {
        setSelected(null);
        setNotes('');
        setConfirmed(false);
      }, 1600);
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
            <TouchableOpacity onPress={() => router.push('/' as any)} activeOpacity={0.8}>
              <Text style={styles.backLink}>Home</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {showResetBanner && (
              <View style={styles.resetBanner}>
                <Text style={styles.resetBannerTitle}>Pulse break complete</Text>
                <Text style={styles.resetBannerText}>
                  {params.reflectionType === 'controllable'
                    ? `You reset and found a next step${params.breakDuration ? ` after ${params.breakDuration} seconds` : ''}.`
                    : `You reset and released the pressure${params.breakDuration ? ` after ${params.breakDuration} seconds` : ''}.`}
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
              <View
                style={[
                  styles.confirmation,
                  (stressCategory === 'high' || stressCategory === 'very_high') && styles.confirmationHigh,
                  stressCategory === 'moderate' && styles.confirmationModerate,
                ]}
              >
                <Text
                  style={[
                    styles.confirmationText,
                    (stressCategory === 'high' || stressCategory === 'very_high') && styles.confirmationTextHigh,
                    stressCategory === 'moderate' && styles.confirmationTextModerate,
                  ]}
                >
                  {stressCategory === 'low' && "You're doing great. Keep it up!"}
                  {stressCategory === 'moderate' && 'Feeling the pressure. A short break could help.'}
                  {stressCategory === 'high' && "Stress detected. Let's take a break."}
                  {stressCategory === 'very_high' && 'High stress detected. You need a break now.'}
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
  backLink: { fontSize: 14, fontFamily: FONTS.semibold, color: COLORS.white },
  scroll: { flex: 1, backgroundColor: COLORS.cream },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
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
  forecastCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 28, borderWidth: 1, borderColor: COLORS.line },
  forecastTitle: { fontSize: 11, fontFamily: FONTS.semibold, color: COLORS.inkSoft, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 },
  forecastRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  forecastTime: { fontSize: 11, color: COLORS.inkSoft, width: 36 },
  forecastBarBg: { width: 100, height: 6, backgroundColor: COLORS.line, borderRadius: 99, overflow: 'hidden' },
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
  notesInput: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, fontSize: 15, color: COLORS.ink, minHeight: 80, textAlignVertical: 'top', borderWidth: 1, borderColor: COLORS.line },
  charCount: { fontSize: 12, color: COLORS.inkSoft, textAlign: 'right', marginTop: 4, marginBottom: 16 },
  submitButton: { backgroundColor: COLORS.teal, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  submitText: { color: COLORS.white, fontSize: 16, fontFamily: FONTS.semibold },
  quote: { marginTop: 20, fontSize: 14, fontStyle: 'italic', color: COLORS.inkSoft, textAlign: 'center', lineHeight: 22, paddingHorizontal: 8 },
  confirmation: { backgroundColor: COLORS.sage + '22', borderRadius: 12, padding: 20, alignItems: 'center', marginTop: 16, borderWidth: 1, borderColor: COLORS.sage },
  confirmationText: { fontSize: 16, color: COLORS.sageDeep, fontFamily: FONTS.semibold },
  confirmationHigh: { backgroundColor: COLORS.coralSoft, borderColor: COLORS.coral },
  confirmationTextHigh: { color: COLORS.tealDeep },
  confirmationModerate: { backgroundColor: COLORS.tealPale, borderColor: COLORS.tealDeep },
  confirmationTextModerate: { color: COLORS.tealDeep },
});
