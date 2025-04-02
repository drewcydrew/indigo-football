import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
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

  // Add states for web alert dialogs
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [confirmDialogAction, setConfirmDialogAction] = useState<
    "load" | "save"
  >("load");
  const [statusDialogVisible, setStatusDialogVisible] = useState(false);
  const [statusDialogMessage, setStatusDialogMessage] = useState("");
  const [statusDialogSuccess, setStatusDialogSuccess] = useState(true);

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
    if (Platform.OS === "web") {
      setConfirmDialogAction("save");
      setConfirmDialogVisible(true);
    } else {
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
    }
  };

  const handleLoadFromFirestore = async () => {
    if (Platform.OS === "web") {
      setConfirmDialogAction("load");
      setConfirmDialogVisible(true);
    } else {
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
    }
  };

  const handleWebAction = async () => {
    try {
      if (confirmDialogAction === "load") {
        await loadFromFirestore();
        setStatusDialogSuccess(true);
        setStatusDialogMessage("Data loaded from cloud successfully");
      } else {
        await saveToFirestore();
        setStatusDialogSuccess(true);
        setStatusDialogMessage("Data saved to cloud successfully");
      }
    } catch (error) {
      setStatusDialogSuccess(false);
      setStatusDialogMessage(
        confirmDialogAction === "load"
          ? "Failed to load data from cloud"
          : "Failed to save data to cloud"
      );
    }

    setConfirmDialogVisible(false);
    setStatusDialogVisible(true);
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
        onDelete={handleDelete}
      />

      {/* Web confirmation dialog */}
      {Platform.OS === "web" && (
        <Modal
          transparent={true}
          visible={confirmDialogVisible}
          onRequestClose={() => setConfirmDialogVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {confirmDialogAction === "load"
                  ? "Load from Cloud"
                  : "Save to Cloud"}
              </Text>
              <Text style={styles.modalText}>
                {confirmDialogAction === "load"
                  ? "This will replace your current data with the cloud version. Are you sure?"
                  : "Are you sure you want to save the current data to the cloud?"}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setConfirmDialogVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleWebAction}
                >
                  <Text style={styles.modalButtonText}>
                    {confirmDialogAction === "load" ? "Load" : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Web status dialog */}
      {Platform.OS === "web" && (
        <Modal
          transparent={true}
          visible={statusDialogVisible}
          onRequestClose={() => setStatusDialogVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {statusDialogSuccess ? "Success" : "Error"}
              </Text>
              <Text style={styles.modalText}>{statusDialogMessage}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.confirmButton,
                    { width: "100%" },
                  ]}
                  onPress={() => setStatusDialogVisible(false)}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  confirmButton: {
    backgroundColor: "#2196F3",
  },
  modalButtonText: {
    fontWeight: "bold",
    color: "black",
  },
});

export default PlayerDisplay;
