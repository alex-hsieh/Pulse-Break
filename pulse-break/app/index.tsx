import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
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

const DEMO_USERNAME = 'demo';
const DEMO_PASSWORD = 'pulsebreak';

const LOGO_SVG = `
<svg viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg">
  <rect x="40" y="50" width="120" height="120" rx="28" fill="#FFFFFF"/>
  <path d="M 58 110 L 82 110 L 90 78 L 98 142 L 106 98 L 116 110 C 126 110 130 88 140 80 C 150 72 152 98 148 110 C 144 122 132 128 120 120" fill="none" stroke="#1C2B2B" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="120" cy="120" r="3" fill="#7A9E7E"/>
  <text x="182" y="144" font-family="sans-serif" font-size="94" font-weight="700" fill="#FFFFFF">Pulse <tspan font-weight="600" fill="#3D8B8B">Break</tspan></text>
</svg>
`;

export default function LandingScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      setError('');
      router.push('/check_in' as any);
    } else {
      setError('Incorrect username or password.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.heroSection}>
            <SvgXml xml={LOGO_SVG} width={240} height={78} />
            <Text style={styles.tagline}>Your daily stress companion.</Text>
            <Text style={styles.subTagline}>
              Check in, breathe, and reflect in under a minute.
            </Text>
          </View>

          <View style={styles.loginSection}>
            <Text style={styles.loginTitle}>Sign In</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                placeholderTextColor={COLORS.inkSoft}
                value={username}
                onChangeText={(v) => { setUsername(v); setError(''); }}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor={COLORS.inkSoft}
                value={password}
                onChangeText={(v) => { setPassword(v); setError(''); }}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>

            <Text style={styles.demoHint}>Demo: demo / pulsebreak</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  loginSection: {
    backgroundColor: COLORS.cream,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 20,
  },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.ink,
    borderWidth: 1,
    borderColor: '#E0DDD6',
  },
  errorText: {
    fontSize: 13,
    color: COLORS.coral,
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: COLORS.teal,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 4,
  },
  loginButtonText: { color: COLORS.white, fontSize: 17, fontWeight: '700' },
  demoHint: {
    fontSize: 12,
    color: COLORS.inkSoft,
    textAlign: 'center',
    marginTop: 16,
  },
});
