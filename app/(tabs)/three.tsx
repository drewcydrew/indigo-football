import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import NameList from '@/components/NameList'; // Ensure correct import path
import { useNames } from '@/context/NamesContext'; // Import useNames
import AddName from '@/components/AddName'; // Import AddName

export default function TabThreeScreen() {
  return (
    <View style={styles.container}>
      <AddNameWrapper />
      <NameList />
    </View>
  );
}

const AddNameWrapper = () => {
  const { addName } = useNames();
  const handleAdd = (name: string, score: number) => {
    addName(name, score);
  };
  return (
    <View style={styles.addNameWrapper}>
      <AddName onAdd={handleAdd} />
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