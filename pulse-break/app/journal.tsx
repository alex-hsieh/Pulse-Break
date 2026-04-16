import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { saveJournalEntry } from '../utils/storage';

const COLORS = {
  sage: '#7A9E7E',
  teal: '#3D8B8B',
  tealPale: '#E4F2F2',
  coral: '#D4715A',
  cream: '#F8F5EF',
  ink: '#1C2B2B',
  inkMid: '#3D5050',
  inkSoft: '#7A9090',
  white: '#FDFCFA',
  paper: '#FAF8F4',
  line: '#E0DDD6',
};

const JOURNAL_PROMPTS = [
  {
    tag: 'release',
    label: 'Release',
    title: 'What am I ready to let go of?',
    prompt: 'Write the thought, pressure, or moment that feels heaviest right now.',
  },
  {
    tag: 'reframe',
    label: 'Reframe',
    title: 'What story am I telling myself?',
    prompt: 'Name the stress story, then rewrite it in a calmer, more realistic way.',
  },
  {
    tag: 'gratitude',
    label: 'Gratitude',
    title: 'What is still steady today?',
    prompt: 'List one person, one strength, or one small win that is still supporting you.',
  },
  {
    tag: 'next_step',
    label: 'Next Step',
    title: 'What is one thing I can control next?',
    prompt: 'Choose one tiny step that would make the rest of the day feel lighter.',
  },
] as const;

type PromptTag = (typeof JOURNAL_PROMPTS)[number]['tag'];

export default function JournalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { checkInId, stressCategory, breakDuration } = useLocalSearchParams<{
    checkInId: string;
    stressCategory: string;
    breakDuration: string;
  }>();

  const [selectedTag, setSelectedTag] = useState<PromptTag>('release');
  const [entry, setEntry] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setSelectedTag('release');
      setEntry('');
      setSaving(false);
    }, [])
  );

  const activePrompt = useMemo(
    () => JOURNAL_PROMPTS.find((item) => item.tag === selectedTag) ?? JOURNAL_PROMPTS[0],
    [selectedTag]
  );

  const goToReflection = () => {
    router.push({
      pathname: '/reflection',
      params: { checkInId, stressCategory, breakDuration },
    } as any);
  };

  const handleContinue = async () => {
    setSaving(true);
    try {
      const trimmed = entry.trim();
      if (trimmed) {
        await saveJournalEntry(checkInId ?? 'unknown', trimmed, {
          title: activePrompt.title,
          moodTag: selectedTag,
        });
      }
      goToReflection();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.headerBar, { paddingTop: insets.top - 44 }]}>
        <Text style={styles.headerEyebrow}>Break Journal</Text>
        <Text style={styles.headerSub}>Tier 3 — Full Break</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Put the stress{'\n'}somewhere safe.</Text>
        <Text style={styles.subheader}>
          A quick journal moment can help you empty your head before moving into reflection.
        </Text>

        <View style={styles.promptPicker}>
          {JOURNAL_PROMPTS.map((item) => {
            const isActive = item.tag === selectedTag;
            return (
              <TouchableOpacity
                key={item.tag}
                style={[styles.promptChip, isActive && styles.promptChipActive]}
                onPress={() => setSelectedTag(item.tag)}
                activeOpacity={0.85}
              >
                <Text style={[styles.promptChipText, isActive && styles.promptChipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.promptCard}>
          <Text style={styles.promptCardTitle}>{activePrompt.title}</Text>
          <Text style={styles.promptCardBody}>{activePrompt.prompt}</Text>
        </View>

        <View style={styles.editorCard}>
          <Text style={styles.editorLabel}>Journal entry</Text>
          <TextInput
            style={styles.input}
            value={entry}
            onChangeText={setEntry}
            multiline
            maxLength={400}
            textAlignVertical="top"
            placeholder="Start with what is weighing on you, then write one thing that would help..."
            placeholderTextColor={COLORS.inkSoft}
          />
          <View style={styles.editorFooter}>
            <Text style={styles.editorHint}>Keep it honest. This is for clarity, not perfection.</Text>
            <Text style={styles.charCount}>{entry.length}/400</Text>
          </View>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Why this helps</Text>
          <Text style={styles.noteBody}>
            Naming the stress lowers the mental load. Then the reflection step can focus on control instead of chaos.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleContinue}
          activeOpacity={0.85}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>
            {saving ? 'Saving...' : 'Continue to Reflection'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={goToReflection} activeOpacity={0.8}>
          <Text style={styles.secondaryButtonText}>Skip journaling</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.sage },
  headerBar: {
    backgroundColor: COLORS.sage,
    paddingHorizontal: 24,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerEyebrow: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  scroll: { flex: 1, backgroundColor: COLORS.cream },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 48 },
  header: { fontSize: 28, fontWeight: '700', color: COLORS.ink, lineHeight: 36, marginBottom: 10 },
  subheader: { fontSize: 15, color: COLORS.inkSoft, lineHeight: 22, marginBottom: 24 },
  promptPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  promptChip: {
    borderRadius: 99,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  promptChipActive: { backgroundColor: COLORS.teal, borderColor: COLORS.teal },
  promptChipText: { color: COLORS.inkSoft, fontSize: 13, fontWeight: '600' },
  promptChipTextActive: { color: COLORS.white },
  promptCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  promptCardTitle: { fontSize: 20, fontWeight: '700', color: COLORS.ink, lineHeight: 28, marginBottom: 8 },
  promptCardBody: { fontSize: 15, lineHeight: 22, color: COLORS.inkSoft },
  editorCard: {
    backgroundColor: COLORS.paper,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  editorLabel: { fontSize: 14, fontWeight: '700', color: COLORS.ink, marginBottom: 10 },
  input: {
    minHeight: 180,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.white,
    padding: 14,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.ink,
  },
  editorFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  editorHint: { flex: 1, fontSize: 12, lineHeight: 18, color: COLORS.inkSoft, paddingRight: 8 },
  charCount: { fontSize: 12, color: COLORS.inkSoft },
  noteCard: {
    backgroundColor: COLORS.teal + '12',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.teal + '33',
  },
  noteTitle: {
    fontSize: 12,
    color: COLORS.teal,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  noteBody: { fontSize: 14, lineHeight: 21, color: COLORS.inkMid },
  primaryButton: { backgroundColor: COLORS.ink, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  secondaryButton: { alignItems: 'center', paddingVertical: 12 },
  secondaryButtonText: { fontSize: 14, color: COLORS.inkSoft, fontWeight: '600' },
});
