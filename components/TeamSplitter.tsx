import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNames } from '../context/NamesContext';
import { useThemeColor } from './Themed';

const TeamSplitter = () => {
  const { names } = useNames();
  const textColor = useThemeColor({}, 'text');

  // Split names into two teams
  const teamA = names.filter((_, index) => index % 2 === 0);
  const teamB = names.filter((_, index) => index % 2 !== 0);

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
