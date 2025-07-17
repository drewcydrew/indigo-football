import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text } from "../Themed";
import { Player } from "../../context/NamesContext";
import { FontAwesome } from "@expo/vector-icons";

interface PlayerModalProps {
  visible: boolean;
  player?: Player | null; // Optional - if provided, it's edit mode
  onClose: () => void;
  onSave: (name: string, score: number, bio: string) => void;
  onDelete?: (player: Player) => void;
  title?: string; // Optional custom title
}

const PlayerModal: React.FC<PlayerModalProps> = ({
  visible,
  player,
  onClose,
  onSave,
  onDelete,
  title,
}) => {
  const [name, setName] = useState("");
  const [score, setScore] = useState(1);
  const [bio, setBio] = useState("");
  const [bioExpanded, setBioExpanded] = useState(false);
  const colorScheme = useColorScheme();

  const isEditMode = !!player;
  const modalTitle = title || (isEditMode ? "Edit Player" : "Add Player");

  // Reset form when modal opens/closes or player changes
  useEffect(() => {
    if (visible) {
      if (player) {
        // Edit mode - populate with player data
        setName(player.name);
        setScore(player.score);
        setBio(player.bio || "");
        setBioExpanded(false); // Always start collapsed
      } else {
        // Add mode - reset to defaults
        setName("");
        setScore(1);
        setBio("");
        setBioExpanded(false);
      }
    }
  }, [visible, player]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), score, bio.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    // Reset form
    setName("");
    setScore(1);
    setBio("");
    setBioExpanded(false);
    onClose();
  };

  const handleDelete = () => {
    if (player && onDelete) {
      onDelete(player);
      handleClose();
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
              {modalTitle}
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <FontAwesome name="times" size={20} color={textColor} />
            </TouchableOpacity>

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
                value={name}
                onChangeText={setName}
                placeholder="Enter player name"
                placeholderTextColor={placeholderColor}
                autoFocus={!isEditMode} // Only auto-focus in add mode
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: textColor }]}>
                Skill Level
              </Text>
              <View style={styles.scoreButtonsContainer}>
                {[1, 2, 3, 4, 5].map((scoreValue) => (
                  <TouchableOpacity
                    key={scoreValue}
                    style={[
                      styles.scoreButton,
                      score === scoreValue
                        ? styles.scoreButtonActive
                        : {
                            backgroundColor:
                              colorScheme === "dark" ? "#555" : "#f0f0f0",
                          },
                      {
                        borderColor: colorScheme === "dark" ? "#777" : "#ccc",
                      },
                    ]}
                    onPress={() => setScore(scoreValue)}
                  >
                    <Text
                      style={[
                        styles.scoreButtonText,
                        {
                          color:
                            colorScheme === "dark"
                              ? score === scoreValue
                                ? "white"
                                : "#eee"
                              : score === scoreValue
                              ? "white"
                              : "#333",
                        },
                      ]}
                    >
                      {scoreValue}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Collapsible Bio Section */}
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.bioToggle}
                onPress={() => setBioExpanded(!bioExpanded)}
                activeOpacity={0.7}
              >
                <Text style={[styles.inputLabel, { color: textColor }]}>
                  Bio (Optional)
                </Text>
                <FontAwesome
                  name={bioExpanded ? "chevron-up" : "chevron-down"}
                  size={14}
                  color={textColor}
                />
              </TouchableOpacity>

              {bioExpanded && (
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
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Enter player bio"
                  placeholderTextColor={placeholderColor}
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.button, styles.saveButton]}
                disabled={!name.trim()}
              >
                <FontAwesome name="check" size={16} color="white" />
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>

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
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    justifyContent: "center",
  },
  modalContent: {
    width: "100%",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    position: "relative",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    paddingRight: 30,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 6,
  },
  bioToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    minHeight: 44,
  },
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
  scoreButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  scoreButton: {
    flex: 1,
    height: 44,
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
    fontSize: 15,
    fontWeight: "500",
  },
  buttonContainer: {
    marginTop: 6,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    minHeight: 44,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    width: "100%",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 6,
  },
});

export default PlayerModal;
