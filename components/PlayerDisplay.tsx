import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './Themed';
import { useNames } from '../context/NamesContext';

const PlayerDisplay = () => {
  const { names } = useNames();
  const flatNames = names.flat();
  const halfLength = Math.ceil(flatNames.length / 2);
  const firstColumn = flatNames.slice(0, halfLength);
  const secondColumn = flatNames.slice(halfLength);

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        {firstColumn.map((player, index) => (
          <View key={index} style={styles.playerContainer}>
            <Text style={styles.text}>
              {player.name}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.column}>
        {secondColumn.map((player, index) => (
          <View key={index} style={styles.playerContainer}>
            <Text style={styles.text}>
              {player.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  column: {
    flex: 1,
  },
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  text: {
    fontSize: 17,
    lineHeight: 24,
    paddingLeft: 10,
  },
});

export default PlayerDisplay;
