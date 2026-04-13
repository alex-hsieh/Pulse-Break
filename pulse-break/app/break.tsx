import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BreakScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Break Screen — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F5EF' },
  text: { fontSize: 18, color: '#2D3142' },
});