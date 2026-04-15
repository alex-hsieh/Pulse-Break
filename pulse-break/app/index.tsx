import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, FONTS } from '../utils/theme';

export default function LandingScreen() {
  const router = useRouter();
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.22)).current;
  const [email, setEmail] = useState('vince@pulsebreak.app');
  const [password, setPassword] = useState('••••••••');

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.1,
            duration: 1700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 1700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0.08,
            duration: 1700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.22,
            duration: 1700,
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <View style={styles.brandRow}>
            <View style={styles.brandDot} />
            <Text style={styles.brandText}>Pulse Break</Text>
          </View>

          <View style={styles.hero}>
            <View style={styles.heroCopy}>
              <Text style={styles.eyebrow}>Employee wellness</Text>
              <Text style={styles.title}>A calmer reset, built for the middle of the workday.</Text>
              <Text style={styles.subtitle}>
                Designed to feel like a real product experience: check in, take a pulse break, journal what matters, and move forward with clarity.
              </Text>
            </View>

            <View style={styles.visualWrap}>
              <Animated.View
                style={[
                  styles.visualHalo,
                  {
                    opacity: pulseOpacity,
                    transform: [{ scale: pulseScale }],
                  },
                ]}
              />
              <View style={styles.visualCard}>
                <Text style={styles.visualTime}>2:34 PM</Text>
                <Text style={styles.visualTitle}>Stress reset available now</Text>
                <Text style={styles.visualBody}>Detected pressure spike before the next deadline window.</Text>
                <View style={styles.visualChip}>
                  <Text style={styles.visualChipText}>Guided break ready</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.authCard}>
            <Text style={styles.authTitle}>Welcome back</Text>
            <Text style={styles.authSubtitle}>Sign in to continue your reset flow</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Work email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="name@company.com"
                placeholderTextColor={COLORS.mist}
              />
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.passwordRow}>
                <Text style={styles.fieldLabel}>Password</Text>
                <Text style={styles.fieldAction}>Forgot?</Text>
              </View>
              <TextInput
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry={false}
                placeholder="••••••••"
                placeholderTextColor={COLORS.mist}
              />
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/check-in' as any)}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/check-in' as any)}
              activeOpacity={0.82}
            >
              <Text style={styles.secondaryButtonText}>Continue as Demo User</Text>
            </TouchableOpacity>

            <Text style={styles.footerNote}>
              For the MVP, this is a visual entry screen that leads into the app flow.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  scrollContent: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  shell: {
    gap: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: COLORS.tealDeep,
    marginRight: 10,
  },
  brandText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.ink,
  },
  hero: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  heroCopy: {
    marginBottom: 22,
  },
  eyebrow: {
    fontSize: 11,
    fontFamily: FONTS.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    color: COLORS.tealDeep,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontFamily: FONTS.bold,
    color: COLORS.ink,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.inkMid,
  },
  visualWrap: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualHalo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: COLORS.teal,
  },
  visualCard: {
    width: '88%',
    backgroundColor: COLORS.paper,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  visualTime: {
    fontSize: 11,
    fontFamily: FONTS.semibold,
    color: COLORS.inkSoft,
    marginBottom: 10,
  },
  visualTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: FONTS.bold,
    color: COLORS.ink,
    marginBottom: 8,
  },
  visualBody: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.inkMid,
    marginBottom: 14,
  },
  visualChip: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.sagePale,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  visualChipText: {
    fontSize: 12,
    fontFamily: FONTS.semibold,
    color: COLORS.sageDeep,
  },
  authCard: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  authTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.ink,
    marginBottom: 6,
  },
  authSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.inkSoft,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: FONTS.semibold,
    color: COLORS.inkSoft,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldAction: {
    fontSize: 12,
    fontFamily: FONTS.semibold,
    color: COLORS.tealDeep,
  },
  input: {
    backgroundColor: COLORS.paper,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    color: COLORS.ink,
  },
  primaryButton: {
    backgroundColor: COLORS.tealDeep,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  secondaryButton: {
    backgroundColor: COLORS.tealPale,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  secondaryButtonText: {
    color: COLORS.tealDeep,
    fontSize: 15,
    fontFamily: FONTS.semibold,
  },
  footerNote: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.inkSoft,
    textAlign: 'center',
  },
});
