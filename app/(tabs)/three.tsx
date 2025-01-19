import { StyleSheet } from 'react-native';


import { Text, View } from '@/components/Themed';
import NameList from '@/components/NameList'; // Ensure correct import path

export default function TabThreeScreen() {
  return (
    <View style={styles.container}>
      <NameList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Ensure full width
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  addNameWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});