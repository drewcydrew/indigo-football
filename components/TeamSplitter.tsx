import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNames } from '../context/NamesContext';
import { useThemeColor } from './Themed';

const TeamSplitter = () => {
  const { names } = useNames();
  const textColor = useThemeColor({}, 'text');
  const [teamA, setTeamA] = useState<string[]>([]);
  const [teamB, setTeamB] = useState<string[]>([]);

  useEffect(() => {
    // Split names into two teams
    const newTeamA = names.filter((_, index) => index % 2 === 0);
    const newTeamB = names.filter((_, index) => index % 2 !== 0);
    setTeamA(newTeamA);
    setTeamB(newTeamB);
  }, [names]);

  return (
    <View style={styles.container}>
      <View style={styles.teamContainer}>
        <Text style={[styles.teamTitle, { color: textColor }]}>Team A</Text>
        {teamA.map((name, index) => (
          <Text key={index} style={[styles.nameText, { color: textColor }]}>
            {name}
          </Text>
        ))}
      </View>
      <View style={styles.teamContainer}>
        <Text style={[styles.teamTitle, { color: textColor }]}>Team B</Text>
        {teamB.map((name, index) => (
          <Text key={index} style={[styles.nameText, { color: textColor }]}>
            {name}
          </Text>
        ))}
      </View>
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
