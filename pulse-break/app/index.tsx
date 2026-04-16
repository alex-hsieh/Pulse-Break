import React from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const COLORS = {
  sage: '#7A9E7E',
  teal: '#3D8B8B',
  tealDark: 'rgba(61, 139, 139, 1)',
  lightBlue: '#B1D9E5',
  coral: '#D4715A',
  amber: '#D4A055',
  cream: '#F8F5EF',
  ink: '#1C2B2B',
  inkMid: '#3D5050',
  inkSoft: '#7A9090',
  white: '#FDFCFA',
};

const LOGO_SVG = `
<svg viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg">
  <rect x="40" y="50" width="120" height="120" rx="28" fill="#FFFFFF"/>
  <path d="M 58 110 L 82 110 L 90 78 L 98 142 L 106 98 L 116 110 C 126 110 130 88 140 80 C 150 72 152 98 148 110 C 144 122 132 128 120 120" fill="none" stroke="#1C2B2B" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="120" cy="120" r="3" fill="#7A9E7E"/>
  <text x="182" y="144" font-family="sans-serif" font-size="94" font-weight="700" fill="#FFFFFF">Pulse <tspan font-weight="600" fill="#3D8B8B">Break</tspan></text>
</svg>
`;

const FEATURES = [
  {
    icon: '🫀',
    title: 'Check In',
    description: 'Rate your stress in seconds and log what\'s on your mind.',
  },
  {
    icon: '🌬️',
    title: 'Take a Break',
    description: 'Guided breathing and disconnect exercises tailored to your stress level.',
  },
  {
    icon: '✦',
    title: 'Reflect',
    description: 'Use the Let Them Theory to release what you can\'t control.',
  },
];

export default function LandingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <SvgXml xml={LOGO_SVG} width={240} height={78} />
          <Text style={styles.tagline}>Your daily stress companion.</Text>
          <Text style={styles.subTagline}>
            Check in, breathe, and reflect — in under a minute.
          </Text>
        </View>

        <View style={styles.featuresSection}>
          {FEATURES.map((feature) => (
            <View key={feature.title} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/check_in' as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>Start Check-In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyLink}
          onPress={() => router.push('/history' as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.historyLinkText}>View History</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightBlue },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 48 },
  heroSection: {
    backgroundColor: COLORS.lightBlue,
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  tagline: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.ink,
    marginTop: 24,
    textAlign: 'center',
  },
  subTagline: {
    fontSize: 15,
    color: COLORS.inkMid,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresSection: {
    backgroundColor: COLORS.cream,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 8,
    gap: 12,
  },
  featureCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    borderWidth: 1,
    borderColor: '#E0DDD6',
  },
  featureIcon: { fontSize: 28, lineHeight: 34 },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '700', color: COLORS.ink, marginBottom: 4 },
  featureDesc: { fontSize: 13, color: COLORS.inkSoft, lineHeight: 19 },
  ctaButton: {
    backgroundColor: COLORS.teal,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 28,
  },
  ctaText: { color: COLORS.white, fontSize: 17, fontWeight: '700' },
  historyLink: { alignItems: 'center', paddingVertical: 16 },
  historyLinkText: { fontSize: 14, color: COLORS.inkSoft },
});
