import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import TeamSplitter from '@/components/TeamSplitter'; // Import TeamSplitter
import { NamesProvider } from '@/context/NamesContext'; // Import NamesProvider
import RandomizeTeams from '@/components/RandomizeTeams'; // Import RandomizeTeams

export default function TabTwoScreen() {
  return (
    <NamesProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Tab Two</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <View style={styles.randomizeTeamsWrapper}>
          <RandomizeTeams />
        </View>
        <TeamSplitter />
      </View>
    </NamesProvider>
  );
}

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
  randomizeTeamsWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
