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
  TouchableWithoutFeedback,
  InputAccessoryView,
  Platform,
} from "react-native";
import { Text } from "../Themed";
import Slider from "@react-native-community/slider"; // Import Slider component
import { Player } from "../../context/NamesContext";
import { FontAwesome } from "@expo/vector-icons";

interface PlayerEditModalProps {
  visible: boolean;
  player: Player | null;
  onClose: () => void;
  onSave: (name: string, score: number, bio: string) => void;
  onDelete?: (player: Player) => void; // Add new prop
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
  const [scorePreview, setScorePreview] = React.useState(player?.score || 1);
  const [editedBio, setEditedBio] = React.useState(player?.bio || "");
  const colorScheme = useColorScheme(); // Get the current color scheme

  useEffect(() => {
    if (player) {
      setEditedName(player.name);
      setEditedScore(player.score);
      setEditedBio(player.bio);
    }
  }, [player]);

  const handleSave = () => {
    onSave(editedName, editedScore, editedBio); // Remove matches from handleSave
    onClose();
  };

  const handleDelete = () => {
    if (player && onDelete) {
      onDelete(player);
      onClose();
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
            ]}
          >
            <Text style={styles.modalTitle}>Edit Player</Text>
            <TextInput
              style={[
                styles.input,
                { color: colorScheme === "dark" ? "white" : "black" },
              ]}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Name"
              placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#999"}
            />
            <Text>Score: {scorePreview}</Text>
            <Slider
              value={editedScore}
              onValueChange={setScorePreview}
              onSlidingComplete={setEditedScore}
              minimumValue={1}
              maximumValue={5}
              step={1}
              style={styles.slider}
            />
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { color: colorScheme === "dark" ? "white" : "black" },
              ]}
              value={editedBio}
              onChangeText={setEditedBio}
              placeholder="Bio"
              placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#999"}
              multiline={true}
              numberOfLines={4}
            />

            <View style={styles.buttonRow}>
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
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  slider: {
    width: "100%",
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#607D8B",
    flex: 1,
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  keyboardAccessory: {
    width: "100%",
    padding: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  keyboardDoneButton: {
    padding: 8,
    marginRight: 8,
  },
  keyboardDoneText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PlayerEditModal;
