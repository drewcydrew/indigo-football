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
      <TeamSplitter showScores={showScores} />
      <View style={styles.randomizeTeamsWrapper}>
        <RandomizeTeams showScores={showScores} setShowScores={setShowScores} />
      </View>
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
  randomizeTeamsWrapper: {
    position: 'absolute',
    bottom: 10, // Position at the bottom
    right: 10,
  },
});
