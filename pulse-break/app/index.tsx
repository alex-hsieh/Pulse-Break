import React, { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, FONTS } from '../utils/theme';

const FEATURES = ['Stress check-ins', 'Guided breaks', 'Journaling reset', 'Let Them reflection'];

export default function LandingScreen() {
  const router = useRouter();
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.14,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0.18,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.45,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [pulseOpacity, pulseScale]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <Text style={styles.brand}>Pulse Break</Text>
          <Text style={styles.title}>Pause before pressure takes over.</Text>
          <Text style={styles.subtitle}>
            A calm reset space for check-ins, guided breaks, journaling, and reflection when work starts to feel heavy.
          </Text>

          <View style={styles.visualWrap}>
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
              <Text style={styles.pulseLabel}>Reset starts here</Text>
            </View>
          </View>

          <View style={styles.featureList}>
            {FEATURES.map((feature) => (
              <View key={feature} style={styles.featurePill}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/check-in' as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Start Pulse Break</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/history' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>View History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  brand: {
    fontSize: 12,
    fontFamily: FONTS.semibold,
    color: COLORS.tealDeep,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontFamily: FONTS.bold,
    color: COLORS.ink,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.inkMid,
    marginBottom: 24,
  },
  visualWrap: {
    height: 210,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  pulseHalo: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: COLORS.teal,
  },
  pulseCore: {
    width: 136,
    height: 136,
    borderRadius: 999,
    backgroundColor: COLORS.sagePale,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseIcon: { fontSize: 42, marginBottom: 6 },
  pulseLabel: {
    fontSize: 13,
    fontFamily: FONTS.semibold,
    color: COLORS.tealDeep,
  },
  featureList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  featurePill: {
    backgroundColor: COLORS.tealPale,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  featureText: {
    fontSize: 12,
    fontFamily: FONTS.semibold,
    color: COLORS.tealDeep,
  },
  primaryButton: {
    backgroundColor: COLORS.tealDeep,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: FONTS.semibold,
    color: COLORS.inkSoft,
  },
});
