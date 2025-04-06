import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  useColorScheme,
} from "react-native";
import { Text } from "../Themed"; // Using your themed Text component
import { useNames } from "../../context/NamesContext";
import Icon from "react-native-vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";

const CloudSync = () => {
  const { saveToFirestore, loadFromFirestore } = useNames();
  const colorScheme = useColorScheme();

  // Main modal visibility state
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  // States for web alert dialogs
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [confirmDialogAction, setConfirmDialogAction] = useState<
    "load" | "save"
  >("load");
  const [statusDialogVisible, setStatusDialogVisible] = useState(false);
  const [statusDialogMessage, setStatusDialogMessage] = useState("");
  const [statusDialogSuccess, setStatusDialogSuccess] = useState(true);

  const handleSaveToFirestore = async () => {
    setOptionsModalVisible(false);

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
    setOptionsModalVisible(false);

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

  return (
    <View>
      {/* Cloud Icon Button */}
      <TouchableOpacity
        style={styles.cloudIconButton}
        onPress={() => setOptionsModalVisible(true)}
      >
        <Icon name="cloud" size={28} color="#007bff" />
      </TouchableOpacity>
      {/* Main Options Modal */}
      <Modal
        transparent={true}
        visible={optionsModalVisible}
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
            ]}
          >
            <Text style={styles.modalTitle}>Cloud Sync</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveToFirestore}
              >
                <Icon name="cloud-upload" size={20} color="white" />
                <Text style={styles.buttonText}>Save to Cloud</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.loadButton]}
                onPress={handleLoadFromFirestore}
              >
                <Icon name="cloud-download" size={20} color="white" />
                <Text style={styles.buttonText}>Load from Cloud</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                styles.closeButton,
              ]} /* Changed style name */
              onPress={() => setOptionsModalVisible(false)}
            >
              <FontAwesome name="times" size={16} color="white" />
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Web confirmation dialog */}
      {Platform.OS === "web" && (
        <Modal
          transparent={true}
          visible={confirmDialogVisible}
          onRequestClose={() => setConfirmDialogVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalView,
                { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
              ]}
            >
              <Text style={styles.modalTitle}>
                {confirmDialogAction === "load"
                  ? "Load from Cloud"
                  : "Save to Cloud"}
              </Text>
              <Text>
                {confirmDialogAction === "load"
                  ? "This will replace your current data with the cloud version. Are you sure?"
                  : "Are you sure you want to save the current data to the cloud?"}
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setConfirmDialogVisible(false)}
                >
                  <FontAwesome name="times" size={16} color="white" />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleWebAction}
                >
                  <FontAwesome name="check" size={16} color="white" />
                  <Text style={styles.buttonText}>
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
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalView,
                { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
              ]}
            >
              <Text style={styles.modalTitle}>
                {statusDialogSuccess ? "Success" : "Error"}
              </Text>
              <Text>{statusDialogMessage}</Text>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton, { width: "100%" }]}
                onPress={() => setStatusDialogVisible(false)}
              >
                <FontAwesome name="check" size={16} color="white" />
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cloudIconButton: {
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
    height: "100%",
  },
  modalView: {
    width: 300,
    padding: 20,
    maxHeight: "80%", // Reduced from 100%
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
    marginBottom: 15,
    textAlign: "center",
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5, // Consistent spacing
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  loadButton: {
    backgroundColor: "#2196F3",
  },
  cancelButton: {
    backgroundColor: "#607D8B",
    flex: 1,
    marginRight: 5,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: "#607D8B",
    marginTop: 5,
  },
});

export default CloudSync;
