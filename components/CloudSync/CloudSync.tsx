import React, { useState } from "react";
import { View, TouchableOpacity, Modal, useColorScheme } from "react-native";
import { Text } from "../Themed";
import { useNames } from "../../context/NamesContext";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Import the components
import LoadCloudSync from "./LoadCloudSync";
import SaveCloudSync from "./SaveCloudSync";
import DeleteCloudSync from "./DeleteCloudSync"; // Add this import

import { styles } from "./CloudSyncStyles";

const CloudSync = () => {
  const useNamesContextHook = useNames();
  const colorScheme = useColorScheme();

  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [activeFlow, setActiveFlow] = useState<
    "load" | "save" | "delete" | null
  >(null); // Add "delete"

  const handleOpenLoadFlow = () => {
    setOptionsModalVisible(false);
    setActiveFlow("load");
  };

  const handleOpenSaveFlow = () => {
    setOptionsModalVisible(false);
    setActiveFlow("save");
  };

  const handleOpenDeleteFlow = () => {
    // Add this function
    setOptionsModalVisible(false);
    setActiveFlow("delete");
  };

  const handleFlowClose = () => {
    setActiveFlow(null);
  };

  return (
    <View>
      {/* Cloud Icon Button - Always visible */}
      <TouchableOpacity
        style={styles.cloudIconButton}
        onPress={() => setOptionsModalVisible(true)}
      >
        <Icon
          name="cloud"
          size={28}
          color={colorScheme === "dark" ? "#00aaff" : "#007bff"}
        />
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
              {
                backgroundColor: colorScheme === "dark" ? "#2c2c2e" : "#fefefe",
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: colorScheme === "dark" ? "#fff" : "#000" },
              ]}
            >
              Cloud Sync
            </Text>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleOpenSaveFlow}
              >
                <Icon name="cloud-upload-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Save to Cloud</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.loadButton]}
                onPress={handleOpenLoadFlow}
              >
                <Icon name="cloud-download-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Load from Cloud</Text>
              </TouchableOpacity>

              {/* Add Delete Button */}
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleOpenDeleteFlow}
              >
                <FontAwesome name="trash" size={20} color="white" />
                <Text style={styles.buttonText}>Delete Collection</Text>
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

      {/* Render Load Flow as Modal */}
      {activeFlow === "load" && (
        <LoadCloudSync
          onClose={handleFlowClose}
          useNamesContext={useNamesContextHook}
          colorScheme={colorScheme}
        />
      )}

      {/* Render Save Flow as Modal */}
      {activeFlow === "save" && (
        <SaveCloudSync
          onClose={handleFlowClose}
          useNamesContext={useNamesContextHook}
          colorScheme={colorScheme}
        />
      )}

      {/* Render Delete Flow as Modal */}
      {activeFlow === "delete" && (
        <DeleteCloudSync
          onClose={handleFlowClose}
          useNamesContext={useNamesContextHook}
          colorScheme={colorScheme}
        />
      )}
    </View>
  );
};

export default CloudSync;
