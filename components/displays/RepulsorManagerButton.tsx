import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Text,
  useColorScheme,
  ScrollView,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNames, Player, Repulsor } from "../../context/NamesContext";

const RepulsorManagerButton: React.FC = () => {
  const { names, repulsors, addRepulsor, removeRepulsor } = useNames();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlayer1, setSelectedPlayer1] = useState<string | null>(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState<string | null>(null);

  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "white" : "black";
  const backgroundColor = colorScheme === "dark" ? "#333" : "#fff";

  // Get all player names from all teams
  const allPlayers = names
    .flat()
    //.filter((player) => player.included)
    .map((player) => player.name)
    .sort();

  const handleAddRepulsor = () => {
    if (
      selectedPlayer1 &&
      selectedPlayer2 &&
      selectedPlayer1 !== selectedPlayer2
    ) {
      addRepulsor(selectedPlayer1, selectedPlayer2);
      setSelectedPlayer1(null);
      setSelectedPlayer2(null);
    }
  };

  const renderRepulsorItem = ({ item }: { item: Repulsor }) => (
    <View style={styles.repulsorItem}>
      <Text style={[styles.repulsorText, { color: textColor }]}>
        {item.player1} ⟷ {item.player2}
      </Text>
      <TouchableOpacity
        style={styles.repulsorDeleteButton}
        onPress={() => removeRepulsor(item.player1, item.player2)}
      >
        <Text style={styles.repulsorDeleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="people" size={40} color="#007bff" />
        {repulsors.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{repulsors.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalView, { backgroundColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>
              Player Repulsors
            </Text>
            <Text
              style={{
                color: textColor,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Repulsors are pairs of players that should play on different teams
            </Text>

            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Add New Repulsor
            </Text>

            <View style={styles.playerSelectionContainer}>
              <View style={styles.playerSelector}>
                <Text style={{ color: textColor, marginBottom: 5 }}>
                  Player 1:
                </Text>
                <ScrollView
                  style={styles.playerList}
                  nestedScrollEnabled={true}
                >
                  {allPlayers.map((player) => (
                    <TouchableOpacity
                      key={player}
                      style={[
                        styles.playerItem,
                        selectedPlayer1 === player && styles.selectedPlayerItem,
                      ]}
                      onPress={() => setSelectedPlayer1(player)}
                    >
                      <Text
                        style={[
                          styles.playerItemText,
                          { color: textColor },
                          selectedPlayer1 === player &&
                            styles.selectedPlayerItemText,
                        ]}
                      >
                        {player}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.playerSelector}>
                <Text style={{ color: textColor, marginBottom: 5 }}>
                  Player 2:
                </Text>
                <ScrollView
                  style={styles.playerList}
                  nestedScrollEnabled={true}
                >
                  {allPlayers.map((player) => (
                    <TouchableOpacity
                      key={player}
                      style={[
                        styles.playerItem,
                        selectedPlayer2 === player && styles.selectedPlayerItem,
                      ]}
                      onPress={() => setSelectedPlayer2(player)}
                    >
                      <Text
                        style={[
                          styles.playerItemText,
                          { color: textColor },
                          selectedPlayer2 === player &&
                            styles.selectedPlayerItemText,
                        ]}
                      >
                        {player}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.addButton,
                !selectedPlayer1 ||
                !selectedPlayer2 ||
                selectedPlayer1 === selectedPlayer2
                  ? styles.disabledButton
                  : null,
              ]}
              onPress={handleAddRepulsor}
              disabled={
                !selectedPlayer1 ||
                !selectedPlayer2 ||
                selectedPlayer1 === selectedPlayer2
              }
            >
              <Text style={styles.addButtonText}>Add Repulsor</Text>
            </TouchableOpacity>

            <Text
              style={[styles.sectionTitle, { color: textColor, marginTop: 20 }]}
            >
              Current Repulsors
            </Text>

            {repulsors.length > 0 ? (
              <FlatList
                data={repulsors}
                renderItem={renderRepulsorItem}
                keyExtractor={(item) => `${item.player1}-${item.player2}`}
                style={styles.repulsorList}
              />
            ) : (
              <Text style={{ color: textColor, fontStyle: "italic" }}>
                No repulsors defined yet
              </Text>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    marginHorizontal: 10,
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "85%",
    maxHeight: "90%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
    alignSelf: "flex-start",
  },
  playerSelectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 16,
  },
  playerSelector: {
    width: "48%",
  },
  playerList: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  playerItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  playerItemText: {
    fontSize: 14,
  },
  selectedPlayerItem: {
    backgroundColor: "rgba(0, 123, 255, 0.2)",
  },
  selectedPlayerItemText: {
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
    alignItems: "center",
    width: "100%",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  repulsorList: {
    maxHeight: 150,
    width: "100%",
    marginTop: 5,
  },
  repulsorItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  repulsorText: {
    fontSize: 14,
  },
  repulsorDeleteButton: {
    padding: 5,
    backgroundColor: "#dc3545",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  repulsorDeleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  badge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "#ff3b30",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default RepulsorManagerButton;
