import React, { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { saveCheckIn } from '../utils/storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
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

const COLORS = {
  sage: '#7A9E7E',
  sagePale: '#EAF2EB',
  teal: '#3D8B8B',
  tealDark: 'rgba(61, 139, 139, 1)',
  tealPale: '#7AC8C8',
  lightBlue: '#B1D9E5',
  coral: '#D4715A',
  amber: '#D4A055',
  cream: '#F8F5EF',
  ink: '#1C2B2B',
  inkMid: '#3D5050',
  inkSoft: '#7A9090',
  white: '#FDFCFA',
};

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
  { time: '2 PM',  label: 'Sprint review',   pct: 62, color: '#D4A055' },
  { time: '4 PM',  label: 'Deadline crunch', pct: 85, color: '#D4715A' },
];

const LOGO_SVG = `
<svg viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg">
  <rect x="40" y="50" width="120" height="120" rx="28" fill="#FFFFFF"/>
  <path d="M 58 110 L 82 110 L 90 78 L 98 142 L 106 98 L 116 110 C 126 110 130 88 140 80 C 150 72 152 98 148 110 C 144 122 132 128 120 120" fill="none" stroke="#1C2B2B" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="120" cy="120" r="3" fill="#7A9E7E"/>
  <text x="182" y="144" font-family="sans-serif" font-size="94" font-weight="700" fill="#FFFFFF">Pulse <tspan font-weight="600" fill="#3D8B8B">Break</tspan></text>
</svg>
`;

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
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [stressCategory, setStressCategory] = useState<'low' | 'moderate' | 'high' | 'very_high' | null>(null);

  const encouragement = getDailyEncouragement();

  useFocusEffect(
    useCallback(() => {
      setSelected(null);
      setNotes('');
      setConfirmed(false);
      setStressCategory(null);
    }, [])
  );

  const handleSelect = (level: number) => {
    setSelected(level);
    setConfirmed(false);
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
          <View style={styles.headerBar}>
            <View style={[styles.logoBar, { height: insets.top }]}>
              <SvgXml xml={LOGO_SVG} width={130} height={42} />
            </View>
            <View style={styles.headerRow}>
              <View>
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
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
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
              <Text style={styles.forecastNote}>Based on your calendar events</Text>
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
  container: { flex: 1, backgroundColor: COLORS.lightBlue },
  headerBar: {
    backgroundColor: COLORS.lightBlue,
    flexDirection: 'column',
  },
  logoBar: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  // appName: { fontSize: 0, fontWeight: '600', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 2 },
  greeting: { fontSize: 15, fontWeight: '600', color: COLORS.tealDark },
  stressIndicator: { alignItems: 'flex-end', gap: 4 },
  stressIndicatorLabel: { fontSize: 10, color: 'rgba(61, 139, 139, 1)', textTransform: 'uppercase', letterSpacing: 0.8 },
  stressBarMini: { width: 80, height: 5, backgroundColor: 'rgba(20, 13, 13, 0.25)', borderRadius: 99, overflow: 'hidden' },
  stressBarFill: { height: '100%', backgroundColor: COLORS.teal, borderRadius: 99 },
  stressIndicatorValue: { fontSize: 11, color: 'rgba(61, 139, 139, 1)', fontWeight: '600' },
  scroll: { flex: 1, backgroundColor: COLORS.cream },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20 },
  forecastCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 28, borderWidth: 1, borderColor: '#E0DDD6' },
  forecastTitle: { fontSize: 11, fontWeight: '600', color: COLORS.inkSoft, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 },
  forecastRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  forecastTime: { fontSize: 11, color: COLORS.inkSoft, width: 36 },
  forecastBarBg: { width: 100, height: 6, backgroundColor: '#E0DDD6', borderRadius: 99, overflow: 'hidden' },
  forecastBarFill: { height: '100%', borderRadius: 99 },
  forecastLabel: { fontSize: 12, color: COLORS.inkMid, flex: 1 },
  forecastNote: { fontSize: 10, color: COLORS.inkSoft, fontStyle: 'italic', marginTop: 8, textAlign: 'right' },
  header: { fontSize: 26, fontWeight: '700', color: COLORS.ink, marginBottom: 16 },
  emojiRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  emojiButton: { alignItems: 'center', padding: 6, borderRadius: 12, flex: 1, marginHorizontal: 2, height: 80, justifyContent: 'center' },
  emojiSelected: { backgroundColor: COLORS.sage + '33', borderWidth: 1.5, borderColor: COLORS.sage },
  emoji: { fontSize: 32, marginBottom: 4 },
  emojiLabel: { fontSize: 9, color: COLORS.inkSoft, textAlign: 'center' },
  emojiLabelSelected: { color: COLORS.sage, fontWeight: '600' },
  notesWrapper: { marginTop: 2 },
  notesInput: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, fontSize: 15, color: COLORS.ink, minHeight: 80, textAlignVertical: 'top', borderWidth: 1, borderColor: '#E0DDD6' },
  charCount: { fontSize: 12, color: COLORS.inkSoft, textAlign: 'right', marginTop: 4, marginBottom: 8 },
  submitButton: { backgroundColor: COLORS.teal, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  submitText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  quote: { marginTop: 12, fontSize: 14, fontStyle: 'italic', color: COLORS.inkSoft, textAlign: 'center', lineHeight: 20, paddingHorizontal: 8 },
  confirmation: { backgroundColor: COLORS.sage + '22', borderRadius: 12, padding: 20, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: COLORS.sage },
  confirmationText: { fontSize: 16, color: COLORS.sage, fontWeight: '600' },
  confirmationHigh: { backgroundColor: '#D4715A22', borderColor: '#D4715A' },
  confirmationTextHigh: { color: '#D4715A' },
  confirmationModerate: { backgroundColor: '#D4A05522', borderColor: '#D4A055' },
  confirmationTextModerate: { color: '#D4A055' },
});