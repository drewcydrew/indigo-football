import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
  useColorScheme,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { Text } from "../Themed";
import { Player } from "../../context/NamesContext";
import { FontAwesome } from "@expo/vector-icons";

interface PlayerEditModalProps {
  visible: boolean;
  player: Player | null;
  onClose: () => void;
  onSave: (name: string, score: number, bio: string) => void;
  onDelete?: (player: Player) => void;
}

const PlayerEditModal: React.FC<PlayerEditModalProps> = ({
  visible,
  player,
  onClose,
  onSave,
  onDelete,
}) => {
  const [editedName, setEditedName] = React.useState(player?.name || "");
  const [editedScore, setEditedScore] = React.useState(player?.score || 1);
  const [editedBio, setEditedBio] = React.useState(player?.bio || "");
  const colorScheme = useColorScheme();
  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    if (player) {
      setEditedName(player.name);
      setEditedScore(player.score);
      setEditedBio(player.bio);
    }
  }, [player]);

  const handleSave = () => {
    onSave(editedName, editedScore, editedBio);
    onClose();
  };

  const handleDelete = () => {
    if (player && onDelete) {
      onDelete(player);
      onClose();
    }
  };

  const isDark = colorScheme === "dark";
  const modalBackgroundColor = isDark ? "#333" : "#fff";
  const textColor = isDark ? "white" : "black";
  const borderColor = isDark ? "#555" : "#ccc";
  const placeholderColor = isDark ? "#aaa" : "#888";

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
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
              {player ? "Edit Player" : "Add Player"}
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
                value={editedName}
                onChangeText={setEditedName}
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
                      editedScore === score
                        ? styles.scoreButtonActive
                        : {
                            backgroundColor:
                              colorScheme === "dark" ? "#555" : "#f0f0f0",
                          },
                      {
                        borderColor: colorScheme === "dark" ? "#777" : "#ccc",
                      },
                    ]}
                    onPress={() => setEditedScore(score)}
                  >
                    <Text
                      style={[
                        styles.scoreButtonText,
                        {
                          color:
                            colorScheme === "dark"
                              ? editedScore === score
                                ? "white"
                                : "#eee"
                              : editedScore === score
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
                value={editedBio}
                onChangeText={setEditedBio}
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
                >
                  <FontAwesome name="check" size={16} color="white" />
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onClose}
                  style={[styles.button, styles.cancelButton]}
                >
                  <FontAwesome name="times" size={16} color="white" />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>

              {onDelete && player && (
                <TouchableOpacity
                  onPress={handleDelete}
                  style={[styles.button, styles.deleteButton]}
                >
                  <FontAwesome name="trash" size={16} color="white" />
                  <Text style={styles.buttonText}>Delete Player</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 12,
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
  deleteButton: {
    backgroundColor: "#F44336",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});

export default PlayerEditModal;
