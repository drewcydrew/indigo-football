import React, { useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text } from "../Themed";
import { useNames, Player } from "../../context/NamesContext";
import PlayerEditModal from "./PlayerEditModal";

const PlayerDisplay = () => {
  const { names, updatePlayer, deletePlayer } = useNames();
  const flatNames = names.flat();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const openModal = (player: Player) => {
    setSelectedPlayer(player);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPlayer(null);
  };

  const saveChanges = (name: string, score: number, bio: string) => {
    if (selectedPlayer) {
      updatePlayer(
        selectedPlayer.name,
        name,
        score,
        bio,
        selectedPlayer.matches
      );
      closeModal();
    }
  };

  const handleDelete = (player: Player) => {
    deletePlayer(player);
    closeModal();
  };

  const renderPlayer = (player: Player) => (
    <View style={styles.playerContainer}>
      <Text
        style={styles.text}
        onPress={() => openModal(player)}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {player.name}
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

  const groupedPlayers = flatNames.reduce(
    (result: Player[][], player, index) => {
      const rowIndex = Math.floor(index / 2);
      if (!result[rowIndex]) {
        result[rowIndex] = [];
      }
      result[rowIndex].push(player);
      return result;
    },
    []
  );

  return (
    <View style={styles.container}>
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
        onDelete={handleDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: "100%", // Ensure full width
  },
  scrollView: {
    padding: 0,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%", // Ensure full width
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    width: "100%", // Ensure container takes full width
  },
  text: {
    fontSize: 17,
    lineHeight: 24,
    paddingLeft: 0,
    flex: 1, // Allow text to take available space
    flexShrink: 1, // Allow text to shrink
  },
});

export default PlayerDisplay;
