import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import PlayerDisplay from '@/components/PlayerDisplay';
import { useNames } from '@/context/NamesContext'; // Import useNames
import AddName from '@/components/AddName'; // Import AddName

export default function TabFourScreen() {
  return (
    <View style={styles.container}>
      <PlayerDisplay />
      <AddNameWrapper />
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
    bottom: 10, // Position at the bottom
    right: 10,
  },
});