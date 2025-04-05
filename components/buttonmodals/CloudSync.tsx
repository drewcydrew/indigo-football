import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  Text,
} from "react-native";
import { useNames } from "../../context/NamesContext"; // Import useNames hook
import Icon from "react-native-vector-icons/Ionicons";

const CloudSync = () => {
  const { saveToFirestore, loadFromFirestore } = useNames();

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
        <Icon name="cloud" size={40} color="#2196F3" />
      </TouchableOpacity>

      {/* Main Options Modal */}
      <Modal
        transparent={true}
        visible={optionsModalVisible}
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cloud Sync</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.cloudButton}
                onPress={handleSaveToFirestore}
              >
                <Icon name="cloud-upload" size={24} color="white" />
                <Text style={styles.buttonText}>Save to Cloud</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cloudButton}
                onPress={handleLoadFromFirestore}
              >
                <Icon name="cloud-download" size={24} color="white" />
                <Text style={styles.buttonText}>Load from Cloud</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.cancelButton, { marginTop: 15 }]}
              onPress={() => setOptionsModalVisible(false)}
            >
              <Text style={{ fontWeight: "bold" }}>Cancel</Text>
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
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {confirmDialogAction === "load"
                  ? "Load from Cloud"
                  : "Save to Cloud"}
              </Text>
              <Text style={styles.modalText}>
                {confirmDialogAction === "load"
                  ? "This will replace your current data with the cloud version. Are you sure?"
                  : "Are you sure you want to save the current data to the cloud?"}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setConfirmDialogVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleWebAction}
                >
                  <Text style={styles.modalButtonText}>
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
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {statusDialogSuccess ? "Success" : "Error"}
              </Text>
              <Text style={styles.modalText}>{statusDialogMessage}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.confirmButton,
                    { width: "100%" },
                  ]}
                  onPress={() => setStatusDialogVisible(false)}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cloudIconButton: {
    alignSelf: "flex-end",
    padding: 5,
  },
  optionsContainer: {
    gap: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  cloudButton: {
    flexDirection: "row",
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: "#2196F3",
  },
  modalButtonText: {
    fontWeight: "bold",
    color: "black",
  },
});

export default CloudSync;
