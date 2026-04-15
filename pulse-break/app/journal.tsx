import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { saveJournalEntry } from '../utils/storage';
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from '../utils/theme';

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
  const { checkInId, stressCategory, breakDuration } = useLocalSearchParams<{
    checkInId: string;
    stressCategory: string;
    breakDuration: string;
  }>();

  const [selectedTag, setSelectedTag] = useState<PromptTag>('release');
  const [entry, setEntry] = useState('');
  const [saving, setSaving] = useState(false);

  const activePrompt = useMemo(
    () => JOURNAL_PROMPTS.find((item) => item.tag === selectedTag) ?? JOURNAL_PROMPTS[0],
    [selectedTag]
  );

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
      router.push({
        pathname: '/reflection',
        params: {
          checkInId,
          stressCategory,
          breakDuration,
        },
      } as any);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.inner}>
          <View style={styles.heroCard}>
            <Text style={styles.eyebrow}>Break journal</Text>
            <Text style={styles.header}>Put the stress somewhere safe.</Text>
            <Text style={styles.subheader}>
              A quick journal moment can help you empty your head before you move into reflection.
            </Text>
          </View>

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

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{activePrompt.title}</Text>
            <Text style={styles.cardBody}>{activePrompt.prompt}</Text>
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
              placeholderTextColor={COLORS.mist}
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

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              router.push({
                pathname: '/reflection',
                params: { checkInId, stressCategory, breakDuration },
              } as any)
            }
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Skip journaling</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  scrollContent: { paddingBottom: SPACING.xxxl },
  inner: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, gap: SPACING.lg },
  heroCard: {
    backgroundColor: COLORS.paper,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.line,
    ...SHADOW,
  },
  eyebrow: {
    fontSize: 12,
    color: COLORS.tealDeep,
    fontFamily: FONTS.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  header: {
    fontSize: 31,
    lineHeight: 38,
    fontFamily: FONTS.bold,
    color: COLORS.ink,
    marginBottom: 10,
  },
  subheader: {
    fontSize: 16,
    color: COLORS.inkSoft,
    lineHeight: 24,
  },
  promptPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  promptChip: {
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.paper,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  promptChipActive: {
    backgroundColor: COLORS.teal,
    borderColor: COLORS.teal,
  },
  promptChipText: {
    color: COLORS.inkSoft,
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  promptChipTextActive: {
    color: COLORS.white,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: FONTS.bold,
    color: COLORS.ink,
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.inkSoft,
  },
  editorCard: {
    backgroundColor: COLORS.paper,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  editorLabel: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.ink,
    marginBottom: 10,
  },
  input: {
    minHeight: 220,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.ink,
  },
  editorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  editorHint: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.inkSoft,
    paddingRight: SPACING.sm,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.mist,
  },
  noteCard: {
    backgroundColor: COLORS.teal + '12',
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.teal + '33',
  },
  noteTitle: {
    fontSize: 12,
    color: COLORS.tealDeep,
    fontFamily: FONTS.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  noteBody: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.tealDeep,
  },
  primaryButton: {
    backgroundColor: COLORS.coral,
    borderRadius: RADIUS.sm,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: COLORS.inkSoft,
    fontWeight: '600',
  },
});
