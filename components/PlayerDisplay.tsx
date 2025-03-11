import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text } from "./Themed";
import { useNames, Player } from "../context/NamesContext";
import PlayerEditModal from "./PlayerEditModal";

const PlayerDisplay = () => {
  const {
    names,
    updatePlayer,
    deletePlayer,
    saveToFirestore,
    loadFromFirestore,
  } = useNames(); // Add loadFromFirestore
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

  const handleSaveToFirestore = async () => {
    Alert.alert(
      "Save to Cloud",
      "Are you sure you want to save the current data to the cloud?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save",
          onPress: async () => {
            try {
              await saveToFirestore();
              Alert.alert("Success", "Data saved to cloud successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to save data to cloud");
            }
          },
        },
      ]
    );
  };

  const handleLoadFromFirestore = async () => {
    Alert.alert(
      "Load from Cloud",
      "This will replace your current data with the cloud version. Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Load",
          onPress: async () => {
            try {
              await loadFromFirestore();
              Alert.alert("Success", "Data loaded from cloud successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to load data from cloud");
            }
          },
        },
      ]
    );
  };

  const renderPlayer = (player: Player) => (
    <View style={styles.playerContainer}>
      <Text style={styles.text} onPress={() => openModal(player)}>
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cloudButton}
          onPress={handleSaveToFirestore}
        >
          <Text style={styles.buttonText}>Save to Cloud</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cloudButton}
          onPress={handleLoadFromFirestore}
        >
          <Text style={styles.buttonText}>Load from Cloud</Text>
        </TouchableOpacity>
      </View>

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
        onDelete={handleDelete} // Add the delete handler
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
  },
  text: {
    fontSize: 17,
    lineHeight: 24,
    paddingLeft: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  cloudButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PlayerDisplay;
