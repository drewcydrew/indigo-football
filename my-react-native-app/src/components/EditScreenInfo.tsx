import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View>
      <Text style={{ marginVertical: 10 }}>Edit this screen at:</Text>
      <Text style={{ fontFamily: 'monospace' }}>{path}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Add any specific styles for EditScreenInfo here if needed
});