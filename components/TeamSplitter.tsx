import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNames } from '../context/NamesContext';
import { useThemeColor } from './Themed';

const TeamSplitter = () => {
  const { names } = useNames();
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={styles.container}>
      {names.map((team, teamIndex) => (
        <View key={teamIndex} style={styles.teamContainer}>
          <Text style={[styles.teamTitle, { color: textColor }]}>Team {teamIndex + 1}</Text>
          {team.map((player, playerIndex) => (
            <Text key={playerIndex} style={[styles.nameText, { color: textColor }]}>
              {player.name} (Score: {player.score})
            </Text>
          ))}
        </View>
      ))}
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
});

export default TeamSplitter;
