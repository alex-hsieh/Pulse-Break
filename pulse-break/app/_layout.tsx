import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 280,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="break" />
        <Stack.Screen name="journal" />
        <Stack.Screen name="reflection" />
        <Stack.Screen name="return" />
      </Stack>
    </SafeAreaProvider>
  );
}
