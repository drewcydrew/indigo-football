import React from 'react';
import { View, FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { Text } from './Themed';
import { CheckBox } from 'react-native-elements';
import { useNames } from '../context/NamesContext';

interface Player {
  name: string;
  included: boolean;
}

const NameList = () => {
  const { names, togglePlayerIncluded } = useNames();
  const flatNames: Player[] = names.flat();

  const renderName = (player: Player) => (
    <View style={styles.nameContainer}>
      <CheckBox
        checked={player.included}
        onPress={() => togglePlayerIncluded(player.name)}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        textStyle={{ color: 'black' }}
      />
      <Text style={styles.text}>
        {player.name}
      </Text>
    </View>
  );

  const renderRow = ({ item }: { item: Player[] }) => (
    <View style={styles.row}>
      {item.map((player, index) => (
        <View key={index} style={styles.column}>
          {renderName(player)}
        </View>
      ))}
    </View>
  );

  const groupedNames = flatNames.reduce((result: Player[][], player, index) => {
    const rowIndex = Math.floor(index / 2);
    if (!result[rowIndex]) {
      result[rowIndex] = [];
    }
    result[rowIndex].push(player);
    return result;
  }, []);

  return (
    <FlatList
      data={groupedNames}
      renderItem={renderRow}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  nameContainer: {
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

export default NameList;
