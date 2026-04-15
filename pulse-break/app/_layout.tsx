import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from '../utils/theme';

export default function RootLayout() {
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
            fontWeight: '700',
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
        <Tabs.Screen name="return" options={{ href: null }} />
      </Tabs>
    </SafeAreaProvider>
  );
}
