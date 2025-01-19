import React, { useState } from 'react';
import { StyleSheet, View, FlatList, ListRenderItem } from 'react-native';
import { Text } from './Themed';
import { CheckBox } from 'react-native-elements';
import { useNames, Player } from '../context/NamesContext';
import PlayerEditModal from './PlayerEditModal';

const PlayerDisplay = () => {
  const { names, updatePlayer } = useNames();
  const flatNames = names.flat();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showScores, setShowScores] = useState(false);

  const openModal = (player: Player) => {
    setSelectedPlayer(player);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPlayer(null);
  };

  const saveChanges = (name: string, score: number, bio: string, matches: number) => {
    if (selectedPlayer) {
      updatePlayer(selectedPlayer.name, name, score, bio, matches);
    }
  };

  const renderPlayer = (player: Player) => (
    <View style={styles.playerContainer}>
      <Text style={styles.text} onPress={() => openModal(player)}>
        {player.name} {showScores && `(${player.score})`}
      </Text>
    </View>
  );

  const renderRow = ({ item }: { item: Player[] }) => (
    <View style={styles.row}>
      {item.map((player, index) => (
        <View key={index} style={styles.column}>
          {renderPlayer(player)}
        </View>
      ))}
    </View>
  );

  const groupedPlayers = flatNames.reduce((result: Player[][], player, index) => {
    const rowIndex = Math.floor(index / 2);
    if (!result[rowIndex]) {
      result[rowIndex] = [];
    }
    result[rowIndex].push(player);
    return result;
  }, []);

  return (
    <View style={styles.container}>
      <CheckBox
        title="Show Scores"
        checked={showScores}
        onPress={() => setShowScores(!showScores)}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        textStyle={{ color: 'black' }}
      />
      <FlatList
        data={groupedPlayers}
        renderItem={renderRow}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollView}
      />
      <PlayerEditModal
        visible={modalVisible}
        player={selectedPlayer}
        onClose={closeModal}
        onSave={saveChanges}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scrollView: {
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
