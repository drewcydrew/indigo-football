import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import TeamSplitter from '@/components/TeamSplitter'; // Import TeamSplitter
import RandomizeTeams from '@/components/RandomizeTeams'; // Import RandomizeTeams

export default function TabTwoScreen() {
  const [showScores, setShowScores] = useState(true); // State to toggle scores

  return (
    <View style={styles.container}>
      <View style={styles.randomizeTeamsWrapper}>
        <RandomizeTeams showScores={showScores} setShowScores={setShowScores} />
      </View>
      <TeamSplitter showScores={showScores} />
    </View>
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
