import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  useColorScheme,
  Switch,
} from "react-native";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/Ionicons";
import { useNames } from "../../context/NamesContext";
import RepulsorManagerButton from "../displays/RepulsorManagerButton";
import { Text } from "../Themed"; // Using your themed Text component

const RandomizeTeamsSettingsIcon: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();

  // Get values and setters directly from context
  const {
    showScores,
    setShowScores,
    numTeams,
    setNumTeams,
    algorithm,
    setAlgorithm,
  } = useNames();

  // Initialize local teams number from context
  const [localNumTeams, setLocalNumTeams] = useState(numTeams);

  // Keep local state in sync with context when numTeams changes externally
  useEffect(() => {
    setLocalNumTeams(numTeams);
  }, [numTeams]);

  const handleNumTeamsChange = (value: number) => {
    setLocalNumTeams(value);
    setNumTeams(value);
  };

  return (
    <TouchableOpacity
      style={styles.iconButton}
      onPress={() => setModalVisible(true)}
    >
      <Icon name="settings" size={28} color="#007bff" />

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
            <Text style={styles.modalText}>Settings</Text>
            <Text>Number of Teams: {localNumTeams}</Text>
            <Slider
              value={numTeams}
              onValueChange={setLocalNumTeams}
              onSlidingComplete={setNumTeams}
              minimumValue={2}
              maximumValue={6}
              step={1}
              style={styles.slider}
            />

            <View style={styles.switchContainer}>
              <Text
                style={[
                  styles.switchLabel,
                  { color: colorScheme === "dark" ? "white" : "black" },
                ]}
              >
                Algorithm
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setAlgorithm(algorithm === "scores" ? "players" : "scores")
                }
                style={styles.algorithmToggle}
              >
                <Text style={styles.algorithmText}>
                  {algorithm === "scores" ? "score" : "player"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.switchContainer}>
              <Text
                style={[
                  styles.switchLabel,
                  { color: colorScheme === "dark" ? "white" : "black" },
                ]}
              >
                Repulsors
              </Text>
              <RepulsorManagerButton />
            </View>

            <View style={styles.switchContainer}>
              <Text
                style={[
                  styles.switchLabel,
                  { color: colorScheme === "dark" ? "white" : "black" },
                ]}
              >
                Show Scores
              </Text>
              <Switch
                value={showScores}
                onValueChange={setShowScores}
                trackColor={{ false: "#767577", true: "#007bff" }}
                thumbColor={showScores ? "#f4f3f4" : "#f4f3f4"}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
    justifyContent: "space-between",
  },
  switchLabel: {
    fontSize: 16,
  },
  repulsorContainer: {
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
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
  algorithmToggle: {
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    minWidth: 70,
    alignItems: "center",
  },
  algorithmText: {
    color: "white",
    fontWeight: "500",
  },
});

export default RandomizeTeamsSettingsIcon;
