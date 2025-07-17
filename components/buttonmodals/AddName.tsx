import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { Text } from "../Themed";
import { useNames } from "../../context/NamesContext";
import { FontAwesome } from "@expo/vector-icons";

const AddName: React.FC = () => {
  const { addName, updatePlayer } = useNames();
  const [modalVisible, setModalVisible] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [playerScore, setPlayerScore] = useState(1);
  const [playerBio, setPlayerBio] = useState("");
  const colorScheme = useColorScheme();

  const handleSave = () => {
    if (playerName.trim()) {
      // First add the player with name and score
      addName(playerName.trim(), playerScore);

      // If there's a bio, update the player immediately after adding
      if (playerBio.trim()) {
        // Small delay to ensure the player is added first
        setTimeout(() => {
          updatePlayer(
            playerName.trim(),
            playerName.trim(),
            playerScore,
            playerBio.trim(),
            0
          );
        }, 100);
      }

      setPlayerName("");
      setPlayerScore(1);
      setPlayerBio("");
      setModalVisible(false);
    }
  };

  const handleClose = () => {
    setPlayerName("");
    setPlayerScore(1);
    setPlayerBio("");
    setModalVisible(false);
  };

  const isDark = colorScheme === "dark";
  const modalBackgroundColor = isDark ? "#333" : "#fff";
  const textColor = isDark ? "white" : "black";
  const borderColor = isDark ? "#555" : "#ccc";
  const placeholderColor = isDark ? "#aaa" : "#888";

  return (
    <>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome
          name="plus"
          size={24}
          color={isDark ? "#00aaff" : "#007bff"}
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: modalBackgroundColor },
              ]}
            >
              <Text style={[styles.modalTitle, { color: textColor }]}>
                Add Player
              </Text>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: textColor }]}>
                  Name
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: textColor,
                      borderColor: borderColor,
                      backgroundColor: isDark ? "#444" : "#f9f9f9",
                    },
                  ]}
                  value={playerName}
                  onChangeText={setPlayerName}
                  placeholder="Enter player name"
                  placeholderTextColor={placeholderColor}
                  autoFocus={true}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: textColor }]}>
                  Skill Level
                </Text>
                <View style={styles.scoreButtonsContainer}>
                  {[1, 2, 3, 4, 5].map((score) => (
                    <TouchableOpacity
                      key={score}
                      style={[
                        styles.scoreButton,
                        playerScore === score
                          ? styles.scoreButtonActive
                          : {
                              backgroundColor:
                                colorScheme === "dark" ? "#555" : "#f0f0f0",
                            },
                        {
                          borderColor: colorScheme === "dark" ? "#777" : "#ccc",
                        },
                      ]}
                      onPress={() => setPlayerScore(score)}
                    >
                      <Text
                        style={[
                          styles.scoreButtonText,
                          {
                            color:
                              colorScheme === "dark"
                                ? playerScore === score
                                  ? "white"
                                  : "#eee"
                                : playerScore === score
                                ? "white"
                                : "#333",
                          },
                        ]}
                      >
                        {score}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: textColor }]}>
                  Bio (Optional)
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    {
                      color: textColor,
                      borderColor: borderColor,
                      backgroundColor: isDark ? "#444" : "#f9f9f9",
                    },
                  ]}
                  value={playerBio}
                  onChangeText={setPlayerBio}
                  placeholder="Enter player bio"
                  placeholderTextColor={placeholderColor}
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.buttonContainer}>
                <View style={styles.primaryButtonRow}>
                  <TouchableOpacity
                    onPress={handleSave}
                    style={[styles.button, styles.saveButton]}
                    disabled={!playerName.trim()}
                  >
                    <FontAwesome name="check" size={16} color="white" />
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleClose}
                    style={[styles.button, styles.cancelButton]}
                  >
                    <FontAwesome name="times" size={16} color="white" />
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  addButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  scoreButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  scoreButton: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
  },
  scoreButtonActive: {
    backgroundColor: "#007BFF",
    borderColor: "#0056b3",
  },
  scoreButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  buttonContainer: {
    marginTop: 8,
  },
  primaryButtonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    minHeight: 48,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#607D8B",
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});

export default AddName;
