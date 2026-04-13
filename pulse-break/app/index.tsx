import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';

const COLORS = {
  sage: '#7A9E7E',
  teal: '#3D8B8B',
  coral: '#D4715A',
  cream: '#F8F5EF',
  dark: '#2D3142',
  gray: '#9A9CB0',
  white: '#FFFFFF',
};

const EMOJI_SCALE = [
  { level: 1, emoji: '😌', label: 'Calm' },
  { level: 2, emoji: '🙂', label: 'Okay' },
  { level: 3, emoji: '😐', label: 'Mild' },
  { level: 4, emoji: '😟', label: 'Stressed' },
  { level: 5, emoji: '😰', label: 'Very Stressed' },
];

export default function HomeScreen() {
  const [selected, setSelected] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleSelect = (level: number) => {
    setSelected(level);
    setConfirmed(false);
  };

  const handleSubmit = () => {
    if (!selected) return;
    // TODO: Issue #6 — save to AsyncStorage (Javin)
    setConfirmed(true);
    setTimeout(() => {
      setSelected(null);
      setNotes('');
      setConfirmed(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>

        {/* Header */}
        <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>
        <Text style={styles.header}>How are you feeling?</Text>

        {/* Emoji Scale */}
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
                <Text style={[styles.emojiLabel, isSelected && styles.emojiLabelSelected]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notes input — shown after selection */}
        {selected && !confirmed && (
          <View style={styles.notesWrapper}>
            <TextInput
              style={styles.notesInput}
              placeholder="What's on your mind? (optional)"
              placeholderTextColor={COLORS.gray}
              value={notes}
              onChangeText={setNotes}
              maxLength={200}
              multiline
            />
            <Text style={styles.charCount}>{notes.length}/200</Text>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Log Check-In</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Confirmation */}
        {confirmed && (
          <View style={styles.confirmation}>
            <Text style={styles.confirmationText}>Check-in logged. Keep going!</Text>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.gray,
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 40,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  emojiButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 3,
  },
  emojiSelected: {
    backgroundColor: COLORS.sage + '33', // sage at 20% opacity
    borderWidth: 1.5,
    borderColor: COLORS.sage,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  emojiLabel: {
    fontSize: 10,
    color: COLORS.gray,
    textAlign: 'center',
  },
  emojiLabelSelected: {
    color: COLORS.sage,
    fontWeight: '600',
  },
  notesWrapper: {
    marginTop: 8,
  },
  notesInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: COLORS.dark,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E0DDD6',
  },
  charCount: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: COLORS.teal,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmation: {
    backgroundColor: COLORS.sage + '22',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.sage,
  },
  confirmationText: {
    fontSize: 16,
    color: COLORS.sage,
    fontWeight: '600',
  },
});