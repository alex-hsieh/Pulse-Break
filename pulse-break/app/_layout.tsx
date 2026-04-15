import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Text, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { COLORS, FONTS } from '../utils/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    const TextComponent = Text as typeof Text & { defaultProps?: { style?: unknown } };
    const TextInputComponent = TextInput as typeof TextInput & { defaultProps?: { style?: unknown } };

    TextComponent.defaultProps = TextComponent.defaultProps || {};
    TextComponent.defaultProps.style = [{ fontFamily: FONTS.regular }, TextComponent.defaultProps.style];

    TextInputComponent.defaultProps = TextInputComponent.defaultProps || {};
    TextInputComponent.defaultProps.style = [{ fontFamily: FONTS.regular }, TextInputComponent.defaultProps.style];
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.teal,
          tabBarInactiveTintColor: COLORS.inkSoft,
          tabBarStyle: {
            backgroundColor: COLORS.paper,
            borderTopColor: COLORS.line,
            height: 78,
            paddingTop: 10,
            paddingBottom: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: FONTS.semibold,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Check-In',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>🫀</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>📋</Text>
            ),
          }}
        />
        <Tabs.Screen name="break" options={{ href: null }} />
        <Tabs.Screen name="journal" options={{ href: null }} />
        <Tabs.Screen name="reflection" options={{ href: null }} />
      </Tabs>
    </SafeAreaProvider>
  );
}
