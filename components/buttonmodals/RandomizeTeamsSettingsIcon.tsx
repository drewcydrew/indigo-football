import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Text,
  useColorScheme,
  Switch,
} from "react-native";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/Ionicons";
import { useNames } from "../../context/NamesContext";
import RepulsorManagerButton from "../displays/RepulsorManagerButton";

const RandomizeTeamsSettingsIcon: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();

  // Get values and setters directly from context
  const { showScores, setShowScores, numTeams, setNumTeams } = useNames();

  // Keep algorithm as local state since it's not in context
  const [algorithm, setAlgorithm] = useState("scores");
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
      <Icon name="settings" size={40} color="#007bff" />

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
            <Text style={styles.modalText}>Randomize Teams</Text>
            <Text>Number of Teams: {localNumTeams}</Text>
            <Slider
              value={localNumTeams}
              onValueChange={handleNumTeamsChange}
              minimumValue={2}
              maximumValue={6}
              step={1}
              style={styles.slider}
            />
            <View style={styles.repulsorContainer}>
              <RepulsorManagerButton />
            </View>

            <View style={styles.switchContainer}>
              <Text
                style={[
                  styles.switchLabel,
                  { color: colorScheme === "dark" ? "white" : "black" },
                ]}
              >
                Sort by score?
              </Text>
              <Switch
                value={algorithm === "scores"}
                onValueChange={(val) =>
                  setAlgorithm(val ? "scores" : "players")
                }
              />
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
              <Switch value={showScores} onValueChange={setShowScores} />
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
});

export default RandomizeTeamsSettingsIcon;
