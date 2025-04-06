import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  useColorScheme,
  TextInput,
} from "react-native";
import { Text } from "../Themed";
import { useNames } from "../../context/NamesContext";
import Icon from "react-native-vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";

const CloudSync = () => {
  const {
    saveToFirestore,
    loadFromFirestore,
    currentCollection,
    setCurrentCollection,
  } = useNames();
  const colorScheme = useColorScheme();
  const [collectionName, setCollectionName] = useState(currentCollection);

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
        `Are you sure you want to save the current data to collection "${collectionName}"?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Save",
            onPress: async () => {
              try {
                setCurrentCollection(collectionName);
                await saveToFirestore(collectionName);
                Alert.alert(
                  "Success",
                  `Data saved to "${collectionName}" collection successfully`
                );
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
        `This will replace your current data with the cloud version from collection "${collectionName}". Are you sure?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Load",
            onPress: async () => {
              try {
                setCurrentCollection(collectionName);
                await loadFromFirestore(collectionName);
                Alert.alert(
                  "Success",
                  `Data loaded from "${collectionName}" collection successfully`
                );
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
      setCurrentCollection(collectionName);

      if (confirmDialogAction === "load") {
        await loadFromFirestore(collectionName);
        setStatusDialogSuccess(true);
        setStatusDialogMessage(
          `Data loaded from "${collectionName}" collection successfully`
        );
      } else {
        await saveToFirestore(collectionName);
        setStatusDialogSuccess(true);
        setStatusDialogMessage(
          `Data saved to "${collectionName}" collection successfully`
        );
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

            {/* Collection Name Input */}
            <View style={styles.collectionInputContainer}>
              <Text style={styles.inputLabel}>Collection name:</Text>
              <TextInput
                style={[
                  styles.collectionInput,
                  {
                    color: colorScheme === "dark" ? "white" : "black",
                    borderColor: colorScheme === "dark" ? "#555" : "#ccc",
                  },
                ]}
                value={collectionName}
                onChangeText={setCollectionName}
                placeholder="Enter collection name"
                placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"}
              />
            </View>

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
              style={[styles.button, styles.closeButton]}
              onPress={() => setOptionsModalVisible(false)}
            >
              <FontAwesome name="times" size={16} color="white" />
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Rest of the modal code remains the same */}
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
                  ? `This will replace your current data with the cloud version from collection "${collectionName}". Are you sure?`
                  : `Are you sure you want to save the current data to collection "${collectionName}"?`}
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

      {/* Web status dialog remains the same */}
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
  collectionInputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputLabel: {
    marginBottom: 5,
    fontWeight: "500",
  },
  collectionInput: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    width: "100%",
    marginBottom: 10,
  },
});

export default CloudSync;
