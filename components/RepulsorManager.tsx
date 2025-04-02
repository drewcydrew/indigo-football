import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Text,
  useColorScheme,
  Switch,
  Button,
  Platform,
  ScrollView,
  FlatList,
} from "react-native";
import Slider from "@react-native-community/slider"; // Import Slider component
import Icon from "react-native-vector-icons/Ionicons";
import { useNames, Player, Repulsor } from "../context/NamesContext";

export const RepulsorManager: React.FC = () => {
  const { names, repulsors, addRepulsor, removeRepulsor } = useNames();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlayer1, setSelectedPlayer1] = useState<string | null>(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState<string | null>(null);

  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "white" : "black";

  // Get all player names from all teams
  const allPlayers = names.flat().map((player) => player.name);

  const handleAddRepulsor = () => {
    if (
      selectedPlayer1 &&
      selectedPlayer2 &&
      selectedPlayer1 !== selectedPlayer2
    ) {
      addRepulsor(selectedPlayer1, selectedPlayer2);
      // Reset selections
      setSelectedPlayer1(null);
      setSelectedPlayer2(null);
    }
  };

  const renderRepulsorItem = ({ item }: { item: Repulsor }) => (
    <View style={styles.dropdown}>
      <Text style={[styles.dropdown, { color: textColor }]}>
        {item.player1} ⟷ {item.player2}
      </Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => removeRepulsor(item.player1, item.player2)}
      >
        <Text style={styles.dropdown}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="people" size={24} color="#007bff" />
        <Text style={styles.dropdown}>Manage Repulsors</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
            ]}
          >
            <Text style={styles.modalText}>Player Repulsors</Text>
            <Text style={{ color: textColor, marginBottom: 10 }}>
              Repulsors are pairs of players you prefer to be on different teams
            </Text>

            <Text style={[styles.dropdown, { color: textColor }]}>
              Add New Repulsor
            </Text>

            <View style={styles.dropdown}>
              <View style={styles.dropdown}>
                <Text style={{ color: textColor }}>Player 1:</Text>
                <ScrollView style={styles.dropdown}>
                  {allPlayers.map((player) => (
                    <TouchableOpacity
                      key={player}
                      style={[
                        styles.dropdown,
                        selectedPlayer1 === player && styles.dropdown,
                      ]}
                      onPress={() => setSelectedPlayer1(player)}
                    >
                      <Text
                        style={[
                          styles.dropdown,
                          { color: textColor },
                          selectedPlayer1 === player && styles.dropdown,
                        ]}
                      >
                        {player}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.dropdown}>
                <Text style={{ color: textColor }}>Player 2:</Text>
                <ScrollView style={styles.dropdown}>
                  {allPlayers.map((player) => (
                    <TouchableOpacity
                      key={player}
                      style={[
                        styles.dropdown,
                        selectedPlayer2 === player && styles.dropdown,
                      ]}
                      onPress={() => setSelectedPlayer2(player)}
                    >
                      <Text
                        style={[
                          styles.dropdown,
                          { color: textColor },
                          selectedPlayer2 === player && styles.dropdown,
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
                styles.dropdown,
                !selectedPlayer1 ||
                !selectedPlayer2 ||
                selectedPlayer1 === selectedPlayer2
                  ? styles.dropdown
                  : null,
              ]}
              onPress={handleAddRepulsor}
              disabled={
                !selectedPlayer1 ||
                !selectedPlayer2 ||
                selectedPlayer1 === selectedPlayer2
              }
            >
              <Text style={styles.dropdown}>Add Repulsor</Text>
            </TouchableOpacity>

            <Text
              style={[styles.dropdown, { color: textColor, marginTop: 20 }]}
            >
              Current Repulsors
            </Text>

            {repulsors.length > 0 ? (
              <FlatList
                data={repulsors}
                renderItem={renderRepulsorItem}
                keyExtractor={(item) => `${item.player1}-${item.player2}`}
                style={styles.dropdown}
              />
            ) : (
              <Text style={{ color: textColor, fontStyle: "italic" }}>
                No repulsors defined yet
              </Text>
            )}

            <TouchableOpacity
              style={[styles.button, { marginTop: 20 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  iconButton: {
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  slider: {
    width: "100%",
    height: 40,
    marginVertical: 10,
  },
  dropdownContainer: {
    width: "100%",
    marginVertical: 10,
  },
  dropdownLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  dropdown: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 5,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownOptions: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  dropdownOption: {
    padding: 10,
  },
  dropdownOptionText: {
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  settingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
  },
  bottomLeft: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  bottomRight: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

export default RepulsorManager;
