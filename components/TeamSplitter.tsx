import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNames } from '../context/NamesContext';
import { useThemeColor } from './Themed';

const TeamSplitter = ({ showScores }: { showScores: boolean }) => {
  const { teams } = useNames();
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={styles.container}>
      {teams.map((team) => {
        const totalScore = team.players.reduce((acc, player) => acc + player.score, 0);
        return (
          <View key={team.id} style={styles.teamContainer}>
            <Text style={[styles.teamTitle, { color: textColor }]}>Team {team.id + 1}</Text>
            {showScores && (
              <Text style={[styles.totalScoreText, { color: textColor }]}>Total Score: {totalScore}</Text>
            )}
            {team.players.map((player, playerIndex) => (
              <Text key={playerIndex} style={[styles.nameText, { color: textColor }]}>
                {player.name} {showScores && `(Score: ${player.score})`}
              </Text>
            ))}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  teamTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nameText: {
    fontSize: 16,
    marginVertical: 5,
  },
  totalScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  controls: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  instantButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  instantButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default TeamSplitter;
