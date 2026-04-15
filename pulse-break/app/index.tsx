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

const FEATURES = [
  { title: 'Check in fast', body: 'Log how you feel in seconds before stress builds.' },
  { title: 'Take a pulse break', body: 'Move into guided breathing, journaling, and reset rituals.' },
  { title: 'Reflect clearly', body: 'Use Let Them Theory prompts to separate control from noise.' },
];

export default function LandingScreen() {
  const router = useRouter();
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.36)).current;
  const cardLift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.12,
            duration: 1600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 1600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0.14,
            duration: 1600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.36,
            duration: 1600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    const cardAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(cardLift, {
          toValue: -6,
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(cardLift, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
    cardAnimation.start();

    return () => {
      pulseAnimation.stop();
      cardAnimation.stop();
    };
  }, [cardLift, pulseOpacity, pulseScale]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.logoWrap}>
            <View style={styles.logoDot} />
            <Text style={styles.logoText}>Pulse Break</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/history' as any)} activeOpacity={0.8}>
            <Text style={styles.topLink}>History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroSection}>
          <View style={styles.copyColumn}>
            <Text style={styles.eyebrow}>Workplace wellness, redesigned</Text>
            <Text style={styles.headline}>A calmer way to reset when work starts to feel heavy.</Text>
            <Text style={styles.subheadline}>
              Pulse Break helps you catch stress early, step into a short guided reset, and come back with more clarity and control.
            </Text>

            <View style={styles.ctaRow}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push('/check-in' as any)}
                activeOpacity={0.88}
              >
                <Text style={styles.primaryButtonText}>Start Pulse Break</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push('/check-in' as any)}
                activeOpacity={0.82}
              >
                <Text style={styles.secondaryButtonText}>Preview Check-In</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>2 min</Text>
                <Text style={styles.statLabel}>to check in</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>10-15</Text>
                <Text style={styles.statLabel}>minute reset</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>1 flow</Text>
                <Text style={styles.statLabel}>check in to reflect</Text>
              </View>
            </View>
          </View>

          <View style={styles.previewColumn}>
            <Animated.View
              style={[
                styles.previewGlow,
                {
                  opacity: pulseOpacity,
                  transform: [{ scale: pulseScale }],
                },
              ]}
            />

            <Animated.View style={[styles.phoneCard, { transform: [{ translateY: cardLift }] }]}>
              <View style={styles.phoneTop}>
                <Text style={styles.phoneTopBrand}>Pulse Break</Text>
                <View style={styles.livePill}>
                  <Text style={styles.livePillText}>Live</Text>
                </View>
              </View>

              <Text style={styles.phoneTitle}>How are you feeling right now?</Text>

              <View style={styles.moodRow}>
                {['😌', '🙂', '😐', '😟', '😰'].map((emoji, index) => (
                  <View key={emoji} style={[styles.moodDot, index === 3 && styles.moodDotActive]}>
                    <Text style={styles.moodEmoji}>{emoji}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.previewModule}>
                <Text style={styles.previewModuleLabel}>Suggested next step</Text>
                <Text style={styles.previewModuleTitle}>Take a 10-minute guided pulse break.</Text>
                <Text style={styles.previewModuleText}>
                  Breathe, journal what is weighing on you, and move into reflection.
                </Text>
              </View>

              <View style={styles.previewFooter}>
                <View style={styles.footerBar} />
                <View style={[styles.footerBar, styles.footerBarShort]} />
              </View>
            </Animated.View>
          </View>
        </View>

        <View style={styles.featureSection}>
          {FEATURES.map((feature) => (
            <View key={feature.title} style={styles.featureCard}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureBody}>{feature.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  scrollContent: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 40 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: COLORS.tealDeep,
    marginRight: 10,
  },
  logoText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.ink,
  },
  topLink: {
    fontSize: 14,
    fontFamily: FONTS.semibold,
    color: COLORS.inkSoft,
  },
  heroSection: {
    marginBottom: 28,
  },
  copyColumn: {
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 11,
    fontFamily: FONTS.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    color: COLORS.tealDeep,
    marginBottom: 12,
  },
  headline: {
    fontSize: 34,
    lineHeight: 40,
    fontFamily: FONTS.bold,
    color: COLORS.ink,
    marginBottom: 12,
  },
  subheadline: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.inkMid,
    marginBottom: 22,
  },
  ctaRow: {
    gap: 12,
    marginBottom: 22,
  },
  primaryButton: {
    backgroundColor: COLORS.tealDeep,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  secondaryButtonText: {
    color: COLORS.ink,
    fontSize: 15,
    fontFamily: FONTS.semibold,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  statValue: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.ink,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.inkSoft,
  },
  previewColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  previewGlow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: COLORS.teal,
  },
  phoneCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  phoneTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  phoneTopBrand: {
    fontSize: 12,
    fontFamily: FONTS.semibold,
    color: COLORS.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  livePill: {
    backgroundColor: COLORS.sagePale,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  livePillText: {
    fontSize: 11,
    fontFamily: FONTS.semibold,
    color: COLORS.sageDeep,
  },
  phoneTitle: {
    fontSize: 22,
    lineHeight: 30,
    fontFamily: FONTS.bold,
    color: COLORS.ink,
    marginBottom: 18,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moodDot: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.tealPale,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  moodDotActive: {
    backgroundColor: COLORS.teal,
    borderColor: COLORS.tealDeep,
  },
  moodEmoji: {
    fontSize: 22,
  },
  previewModule: {
    backgroundColor: COLORS.sagePale,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  previewModuleLabel: {
    fontSize: 11,
    fontFamily: FONTS.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: COLORS.sageDeep,
    marginBottom: 8,
  },
  previewModuleTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: FONTS.bold,
    color: COLORS.ink,
    marginBottom: 8,
  },
  previewModuleText: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.inkMid,
  },
  previewFooter: {
    gap: 8,
  },
  footerBar: {
    height: 10,
    borderRadius: 999,
    backgroundColor: COLORS.tealPale,
  },
  footerBarShort: {
    width: '62%',
  },
  featureSection: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  featureTitle: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    color: COLORS.ink,
    marginBottom: 6,
  },
  featureBody: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.inkMid,
  },
});
