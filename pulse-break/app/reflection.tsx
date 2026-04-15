import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { saveReflection } from '../utils/storage';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import promptData from '../content/reflection-prompts.json';
import { COLORS, FONTS } from '../utils/theme';

const PROMPTS: string[] = (promptData as { prompts: { id: string; text: string; category: string }[] }).prompts.map(p => p.text);

const FOLLOW_UPS = {
  controllable: {
    headline: "Let me take action.",
    message: "You have the power to change this. Take one small step when you're ready — you don't have to solve it all right now.",
  },
  uncontrollable: {
    headline: "Let them.",
    message: "This is not yours to carry. You cannot control others — only your response. Release it, and protect your energy.",
  },
};

type Response = 'controllable' | 'uncontrollable' | null;

export default function ReflectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { checkInId, stressCategory, breakDuration } = useLocalSearchParams<{
    checkInId: string;
    stressCategory: string;
    breakDuration: string;
  }>();
  const [response, setResponse] = useState<Response>(null);
  const [prompt] = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);

  const handleResponse = async (type: 'controllable' | 'uncontrollable') => {
    await saveReflection(checkInId ?? 'unknown', prompt, type);
    setResponse(type);
  };

  const followUp = response ? FOLLOW_UPS[response] : null;

  useFocusEffect(
    useCallback(() => {
      setResponse(null);
    }, [])
  );

  const handleDone = () => {
    router.push({
      pathname: '/',
      params: {
        reset: '1',
        stressCategory,
        breakDuration,
        reflectionType: response ?? 'uncontrollable',
      },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.headerBar, { paddingTop: insets.top + 14 }]}>
        <Text style={styles.headerEyebrow}>Reflection</Text>
        <Text style={styles.headerSub}>Let Them Theory</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Take a breath.{'\n'}Then ask yourself:</Text>

        <View style={styles.promptCard}>
          <Text style={styles.promptLabel}>✦ Let Them Reflection</Text>
          <Text style={styles.promptText}>{prompt}</Text>
        </View>

        {!response && (
          <View style={styles.responseRow}>
            <TouchableOpacity style={[styles.responseButton, styles.responseYes]} onPress={() => handleResponse('controllable')} activeOpacity={0.8}>
              <Text style={styles.responseYesText}>Yes — Let Me act</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.responseButton, styles.responseNo]} onPress={() => handleResponse('uncontrollable')} activeOpacity={0.8}>
              <Text style={styles.responseNoText}>No — Let Them</Text>
            </TouchableOpacity>
          </View>
        )}

        {followUp && (
          <View style={[styles.followUpCard, response === 'controllable' ? styles.followUpTeal : styles.followUpSage]}>
            <Text style={[styles.followUpHeadline, response === 'controllable' ? styles.followUpTealText : styles.followUpSageText]}>
              {followUp.headline}
            </Text>
            <Text style={styles.followUpMessage}>{followUp.message}</Text>
          </View>
        )}

        <View style={styles.robbinsCard}>
          <Text style={styles.robbinsQuote}>"You can't control others — only your response to them."</Text>
          <Text style={styles.robbinsAttrib}>— Mel Robbins, The Let Them Theory</Text>
        </View>

        {response && (
          <TouchableOpacity style={styles.doneButton} onPress={handleDone} activeOpacity={0.8}>
            <Text style={styles.doneText}>Back to Home</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.tealDeep },
  headerBar: {
    backgroundColor: COLORS.tealDeep,
    paddingHorizontal: 24,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerEyebrow: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontFamily: FONTS.semibold, textTransform: 'uppercase', letterSpacing: 0.8 },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  scroll: { flex: 1, backgroundColor: COLORS.cream },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 48 },
  header: { fontSize: 28, fontFamily: FONTS.bold, color: COLORS.ink, lineHeight: 36, marginBottom: 28 },
  promptCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: COLORS.line },
  promptLabel: { fontSize: 11, color: COLORS.tealDeep, fontFamily: FONTS.semibold, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  promptText: { fontSize: 20, fontFamily: FONTS.semibold, color: COLORS.ink, lineHeight: 28 },
  responseRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  responseButton: { flex: 1, borderRadius: 12, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5 },
  responseYes: { backgroundColor: COLORS.teal, borderColor: COLORS.teal },
  responseNo: { backgroundColor: COLORS.white, borderColor: COLORS.sage },
  responseYesText: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 15 },
  responseNoText: { color: COLORS.sageDeep, fontFamily: FONTS.bold, fontSize: 15 },
  followUpCard: { borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1 },
  followUpTeal: { backgroundColor: COLORS.teal + '15', borderColor: COLORS.teal + '44' },
  followUpSage: { backgroundColor: COLORS.sage + '15', borderColor: COLORS.sage + '44' },
  followUpHeadline: { fontSize: 20, fontFamily: FONTS.bold, marginBottom: 8 },
  followUpTealText: { color: COLORS.teal },
  followUpSageText: { color: COLORS.sage },
  followUpMessage: { fontSize: 15, color: COLORS.inkMid, lineHeight: 22 },
  robbinsCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E0DDD6', alignItems: 'center' },
  robbinsQuote: { fontSize: 14, fontStyle: 'italic', color: COLORS.inkMid, textAlign: 'center', lineHeight: 22, marginBottom: 6 },
  robbinsAttrib: { fontSize: 12, color: COLORS.inkSoft, textAlign: 'center' },
  doneButton: { backgroundColor: COLORS.ink, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  doneText: { color: COLORS.white, fontSize: 16, fontFamily: FONTS.semibold },
});
