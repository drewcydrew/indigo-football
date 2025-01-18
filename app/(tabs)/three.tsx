import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import NameList from '@/components/NameList'; // Ensure correct import path
import { NamesProvider, useNames } from '@/context/NamesContext'; // Import NamesProvider and useNames
import AddName from '@/components/AddName'; // Import AddName

export default function TabThreeScreen() {
  return (
    <NamesProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Tab Three</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <AddNameWrapper />
        <NameList />
      </View>
    </NamesProvider>
  );
}

const AddNameWrapper = () => {
  const { addName } = useNames();
  return (
    <View style={styles.addNameWrapper}>
      <AddName onAdd={addName} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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