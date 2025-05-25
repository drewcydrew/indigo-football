import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  useColorScheme,
  // Platform, // No longer needed directly here for complex logic
} from "react-native";
// Import Text from Themed if you are using it for the title, otherwise from react-native
import { Text } from "../Themed"; // Or import { Text } from "react-native";
import { useNames } from "../../context/NamesContext";
import Icon from "react-native-vector-icons/Ionicons"; // Or your preferred Icon set
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Or your preferred Icon set

// Import the new components
import LoadCloudSync from "./LoadCloudSync";
import SaveCloudSync from "./SaveCloudSync";

// Import styles from the dedicated styles file
import { styles } from "./CloudSyncStyles";

const CloudSync = () => {
  const useNamesContextHook = useNames(); // Renamed to avoid conflict if useNames is destructured
  const colorScheme = useColorScheme();

  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [activeFlow, setActiveFlow] = useState<"load" | "save" | null>(null);

  const handleOpenLoadFlow = () => {
    setOptionsModalVisible(false);
    setActiveFlow("load");
  };

  const handleOpenSaveFlow = () => {
    setOptionsModalVisible(false);
    setActiveFlow("save");
  };

  const handleFlowClose = () => {
    setActiveFlow(null);
    // Optionally, re-open the main options modal or just close everything
    // setOptionsModalVisible(true); // If you want to go back to options
  };

  // Render Load Flow
  if (activeFlow === "load") {
    return (
      <LoadCloudSync
        onClose={handleFlowClose}
        useNamesContext={useNamesContextHook}
        colorScheme={colorScheme}
      />
    );
  }

  // Render Save Flow
  if (activeFlow === "save") {
    return (
      <SaveCloudSync
        onClose={handleFlowClose}
        useNamesContext={useNamesContextHook}
        colorScheme={colorScheme}
      />
    );
  }

  // Render Main Options Button and Modal
  return (
    <View>
      {/* Cloud Icon Button */}
      <TouchableOpacity
        style={styles.cloudIconButton}
        onPress={() => setOptionsModalVisible(true)}
      >
        {/* Make sure Icon is imported and used correctly */}
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
              }, // Adjusted dark/light background
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
    </View>
  );
};

// The StyleSheet.create({...}) block that was previously here should now be in CloudSyncStyles.ts
// Ensure CloudSyncStyles.ts is correctly imported.

export default CloudSync;
