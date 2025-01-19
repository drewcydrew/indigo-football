import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import TeamSplitter from '@/components/TeamSplitter'; // Import TeamSplitter
import { RandomizeTeamsSettingsIcon, RandomizeTeamsRandomizeIcon } from '@/components/RandomizeTeams'; // Import new components
import { useNames, Player } from '@/context/NamesContext'; // Import useNames
import PlayerEditModal from '@/components/PlayerEditModal'; // Import PlayerEditModal

export default function TabTwoScreen() {
  const [showScores, setShowScores] = useState(true); // State to toggle scores
  const [numTeams, setNumTeams] = useState(2); // State to set number of teams
  const { names, saveTeams, updatePlayer } = useNames(); // Use context to get names, saveTeams, and updatePlayer
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null); // State to manage selected player
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility

  const handleRandomize = () => {
    const allPlayers = [...names.flat()].filter(player => player.included).sort(() => Math.random() - 0.5);
    const teams: Player[][] = Array.from({ length: numTeams }, () => []);

    const teamScores = Array(numTeams).fill(0);
    allPlayers.forEach(player => {
      const minScoreIndex = teamScores.indexOf(Math.min(...teamScores));
      teams[minScoreIndex].push(player);
      teamScores[minScoreIndex] += player.score;
    });

    saveTeams(teams);
  };

  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setModalVisible(true);
  };

  const handleSavePlayer = (name: string, score: number, bio: string) => {
    if (selectedPlayer) {
      updatePlayer(selectedPlayer.name, name, score, bio, selectedPlayer.matches);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TeamSplitter showScores={showScores} />
      <View style={styles.randomizeTeamsWrapper}>
        <RandomizeTeamsRandomizeIcon onRandomize={handleRandomize} />
        <RandomizeTeamsSettingsIcon numTeams={numTeams} setNumTeams={setNumTeams} showScores={showScores} setShowScores={setShowScores} />
      </View>
      <PlayerEditModal
        visible={modalVisible}
        player={selectedPlayer}
        onClose={() => setModalVisible(false)}
        onSave={handleSavePlayer}
      />
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
