import React, { useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text } from "../Themed";
import { useNames, Player } from "../../context/NamesContext";
import PlayerEditModal from "./PlayerEditModal";
import InfoDisplay from "../InfoDisplay";

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
      {flatNames.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No players. Create players or load collection from cloud.
          </Text>
        </View>
      ) : (
        <FlatList
          data={groupedPlayers}
          renderItem={renderRow}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.scrollView}
        />
      )}

      <PlayerEditModal
        visible={modalVisible}
        player={selectedPlayer}
        onClose={closeModal}
        onSave={saveChanges}
        onDelete={handleDelete}
      />

      <InfoDisplay
        title="Players"
        content="Use cloud button in top left to load saved players from cloud (or to back up current players). Use add button in top right to add players. Click player to edit details"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: "100%",
    position: "relative", // Added to ensure InfoDisplay positioning works correctly
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
  },
  scrollView: {
    padding: 0,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%",
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    width: "100%",
  },
  text: {
    fontSize: 17,
    lineHeight: 24,
    paddingLeft: 0,
    flex: 1,
    flexShrink: 1,
  },
});

export default PlayerDisplay;
