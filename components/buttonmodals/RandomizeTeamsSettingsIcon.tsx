import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  useColorScheme,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNames } from "../../context/NamesContext";
import RepulsorManagerButton from "../displays/RepulsorManagerButton";
import { Text } from "../Themed";
import { useTeamGeneration } from "../../context/useGenerateTeams";

const RandomizeTeamsSettingsIcon: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const { generateTeams } = useTeamGeneration();

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
  // Track the last team number when we generated teams
  const [lastGeneratedTeamNum, setLastGeneratedTeamNum] = useState(numTeams);

  // Keep local state in sync with context when numTeams changes externally
  useEffect(() => {
    setLocalNumTeams(numTeams);
  }, [numTeams]);

  const handleNumTeamsChange = (value: number) => {
    // Update UI state immediately
    setLocalNumTeams(value);
    setNumTeams(value);

    // Auto-regenerate teams when number of teams changes
    if (value !== lastGeneratedTeamNum) {
      console.log(
        `Teams changed from ${lastGeneratedTeamNum} to ${value}, regenerating...`
      );

      // Call generateTeams with the new value directly
      generateTeams(value); // We need to modify the hook to accept this parameter
      setLastGeneratedTeamNum(value);
    }
  };

  // Also regenerate teams when algorithm changes
  const handleAlgorithmChange = () => {
    const newAlgorithm = algorithm === "scores" ? "players" : "scores";
    setAlgorithm(newAlgorithm);

    // Pass the current team number explicitly
    generateTeams(numTeams, newAlgorithm);
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
            <Text style={styles.settingLabel}>Number of Teams:</Text>

            <View style={styles.teamsButtonsContainer}>
              {[2, 3, 4, 5, 6].map((teamNum) => (
                <TouchableOpacity
                  key={teamNum}
                  style={[
                    styles.teamButton,
                    numTeams === teamNum
                      ? styles.teamButtonActive
                      : {
                          backgroundColor:
                            colorScheme === "dark" ? "#555" : "#f0f0f0",
                        },
                    { borderColor: colorScheme === "dark" ? "#777" : "#ccc" },
                  ]}
                  onPress={() => handleNumTeamsChange(teamNum)}
                >
                  <Text
                    style={[
                      styles.teamButtonText,
                      {
                        color:
                          colorScheme === "dark"
                            ? numTeams === teamNum
                              ? "white"
                              : "#eee"
                            : numTeams === teamNum
                            ? "white"
                            : "#333",
                      },
                    ]}
                  >
                    {teamNum}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

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
                onPress={handleAlgorithmChange}
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
    padding: 20,
  },
  modalView: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  settingLabel: {
    alignSelf: "flex-start",
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  teamsButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    gap: 8,
  },
  teamButton: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  teamButtonActive: {
    backgroundColor: "#007BFF",
    borderColor: "#0056b3",
  },
  teamButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    justifyContent: "space-between",
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    minHeight: 48,
    backgroundColor: "#607D8B",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  algorithmToggle: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    minHeight: 48,
  },
  algorithmText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default RandomizeTeamsSettingsIcon;
