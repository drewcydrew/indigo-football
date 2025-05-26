import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
  FlatList,
  useColorScheme,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { useNames } from "../../context/NamesContext"; // Adjust path as needed
// Assuming styles are in a shared file or you'll move them
import { styles } from "./CloudSyncStyles"; // Create or adjust this path

interface SaveCloudSyncProps {
  onClose: () => void;
  useNamesContext: ReturnType<typeof useNames>;
  colorScheme: "light" | "dark" | null | undefined;
}

const SaveCloudSync: React.FC<SaveCloudSyncProps> = ({
  onClose,
  useNamesContext,
  colorScheme,
}) => {
  const {
    saveToFirestore,
    currentCollection,
    setCurrentCollection,
    listCollections,
  } = useNamesContext;

  const [collectionName, setCollectionName] = useState(currentCollection);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Modal states
  const [saveOptionsModalVisible, setSaveOptionsModalVisible] = useState(true); // Initial options
  const [saveCollectionModalVisible, setSaveCollectionModalVisible] =
    useState(false); // Input name for "Save as New"
  const [savePasswordPromptVisible, setSavePasswordPromptVisible] =
    useState(false); // Web: Ask if password protect
  const [savePasswordDialogVisible, setSavePasswordDialogVisible] =
    useState(false); // Web/Android: Enter password for save
  const [confirmSaveDialogVisible, setConfirmSaveDialogVisible] =
    useState(false); // Web: Confirm save

  // Collections list for "Update Existing"
  const [collections, setCollections] = useState<
    { name: string; lastUpdated: string; hasPassword: boolean }[]
  >([]);
  const [collectionsModalVisible, setCollectionsModalVisible] = useState(false);
  const [loadingCollections, setLoadingCollections] = useState(false);

  // Web Status Dialog
  const [statusDialogVisible, setStatusDialogVisible] = useState(false);
  const [statusDialogMessage, setStatusDialogMessage] = useState("");
  const [statusDialogSuccess, setStatusDialogSuccess] = useState(true);

  const showWebStatusDialog = (message: string, success: boolean) => {
    setStatusDialogMessage(message);
    setStatusDialogSuccess(success);
    setStatusDialogVisible(true);
  };

  const fetchCollections = async () => {
    setLoadingCollections(true);
    try {
      const availableCollections = await listCollections();
      setCollections(availableCollections);
    } catch (error) {
      if (Platform.OS === "web") {
        showWebStatusDialog("Failed to fetch collections", false);
      } else {
        Alert.alert("Error", "Failed to fetch collections");
      }
    } finally {
      setLoadingCollections(false);
    }
  };

  const handleSaveAsNew = () => {
    setSaveOptionsModalVisible(false);
    setCollectionName(""); // Clear name for new collection
    setPassword(""); // Clear password
    setSaveCollectionModalVisible(true);
  };

  const handleUpdateExisting = async () => {
    setSaveOptionsModalVisible(false);
    setCollectionsModalVisible(true);
    await fetchCollections();
  };

  const handleCollectionSelectForUpdate = (selectedName: string) => {
    setCollectionsModalVisible(false);
    setCollectionName(selectedName);
    setPassword(""); // Clear password for update, will be asked again
    promptForPasswordProtection(selectedName);
  };

  const handleSaveAsNewContinue = () => {
    if (!collectionName.trim()) {
      Alert.alert("Validation Error", "Collection name cannot be empty.");
      setSaveCollectionModalVisible(true); // Re-show modal to allow correction
      return;
    }
    setSaveCollectionModalVisible(false);
    promptForPasswordProtection(collectionName);
  };

  const promptForPasswordProtection = (name: string) => {
    if (Platform.OS === "web") {
      setSavePasswordPromptVisible(true);
    } else {
      Alert.alert(
        "Password Protection",
        "Do you want to password protect this collection?",
        [
          { text: "No", onPress: () => confirmSaveMobile(name, "") },
          {
            text: "Yes",
            onPress: () => {
              if (Platform.OS === "ios") {
                Alert.prompt(
                  "Set Password",
                  "Enter a password to protect your collection:",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                      onPress: () => onClose(), // Abort entire save if password setting is cancelled
                    },
                    {
                      text: "Set",
                      onPress: (pwd) => confirmSaveMobile(name, pwd || ""),
                    },
                  ],
                  "secure-text"
                );
              } else {
                // Android
                setPassword("");
                setSavePasswordDialogVisible(true); // Show custom Android password input
              }
            },
          },
        ]
      );
    }
  };

  const handlePasswordChoiceForWeb = (usePassword: boolean) => {
    setSavePasswordPromptVisible(false);
    if (usePassword) {
      setPassword("");
      setSavePasswordDialogVisible(true); // Show web password input
    } else {
      // Proceed without password for web
      setConfirmSaveDialogVisible(true); // Show web confirm save dialog
    }
  };

  const handleWebOrAndroidPasswordSet = (pwd: string) => {
    // Called after password input on Web or Android
    setSavePasswordDialogVisible(false);
    setPassword(pwd); // Set the password
    if (Platform.OS === "web") {
      setConfirmSaveDialogVisible(true); // Show web confirm save dialog
    } else {
      // Android
      confirmSaveMobile(collectionName, pwd);
    }
  };

  const executeSave = async (name: string, pwd?: string) => {
    // Ensure that an empty string password is treated as undefined (no password)
    // This helps standardize the "no password" case for the saveToFirestore function.
    const effectivePassword = pwd === "" ? undefined : pwd;
    try {
      setCurrentCollection(name);
      await saveToFirestore(name, effectivePassword);
      const successMessage = `Data saved to "${name}" collection successfully${
        effectivePassword ? " (Password Protected)" : ""
      }`;
      if (Platform.OS === "web") {
        showWebStatusDialog(successMessage, true);
      } else {
        Alert.alert("Success", successMessage);
      }
      onClose(); // Close the save flow
    } catch (error) {
      const errorMessage = "Failed to save data to cloud";
      if (Platform.OS === "web") {
        showWebStatusDialog(errorMessage, false);
      } else {
        Alert.alert("Error", errorMessage);
      }
    }
  };

  const confirmSaveMobile = (name: string, pwd?: string) => {
    Alert.alert(
      "Save to Cloud",
      `Are you sure you want to save the current data to collection "${name}"?${
        pwd ? "\n\nThis collection will be password protected." : ""
      }`,
      [
        { text: "Cancel", style: "cancel", onPress: () => onClose() }, // Abort if final confirmation is cancelled
        { text: "Save", onPress: async () => await executeSave(name, pwd) },
      ]
    );
  };

  const handleWebConfirmSave = async () => {
    setConfirmSaveDialogVisible(false);
    await executeSave(collectionName, password); // password state should be set
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <View>
      {/* Save Options Modal (Initial) */}
      <Modal
        transparent={true}
        visible={saveOptionsModalVisible}
        onRequestClose={() => {
          setSaveOptionsModalVisible(false);
          onClose();
        }}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: colorScheme === "dark" ? "#fff" : "#000" },
              ]}
            >
              Save Options
            </Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveAsNew}
              >
                <FontAwesome name="plus-circle" size={20} color="white" />
                <Text style={styles.buttonText}>Save as New</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.loadButton]} // Assuming loadButton style is fine
                onPress={handleUpdateExisting}
              >
                <FontAwesome name="refresh" size={20} color="white" />
                <Text style={styles.buttonText}>Update Existing</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => {
                setSaveOptionsModalVisible(false);
                onClose();
              }}
            >
              <FontAwesome name="times" size={16} color="white" />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Save Collection Name Modal (for "Save as New") */}
      <Modal
        transparent={true}
        visible={saveCollectionModalVisible}
        onRequestClose={() => {
          setSaveCollectionModalVisible(false);
          setSaveOptionsModalVisible(true); // Go back to options instead of closing all
        }}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: colorScheme === "dark" ? "#fff" : "#000" },
              ]}
            >
              Save New Collection
            </Text>
            <View style={styles.collectionInputContainer}>
              <Text
                style={[
                  styles.inputLabel,
                  { color: colorScheme === "dark" ? "#fff" : "#000" },
                ]}
              >
                Collection name:
              </Text>
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
                autoFocus={true}
              />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setSaveCollectionModalVisible(false);
                  setSaveOptionsModalVisible(true); // Go back to save options
                }}
              >
                <FontAwesome name="arrow-left" size={16} color="white" />
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleSaveAsNewContinue}
              >
                <FontAwesome name="arrow-right" size={16} color="white" />
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Collections Modal (for "Update Existing") */}
      <Modal
        transparent={true}
        visible={collectionsModalVisible}
        onRequestClose={() => {
          setCollectionsModalVisible(false);
          setSaveOptionsModalVisible(true); // Go back to options instead of closing all
        }}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: colorScheme === "dark" ? "#fff" : "#000" },
              ]}
            >
              Select Collection to Update
            </Text>
            {loadingCollections ? (
              <ActivityIndicator
                size="large"
                color={colorScheme === "dark" ? "#FFFFFF" : "#007bff"}
              />
            ) : (
              <FlatList
                data={collections}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.collectionItem}
                    onPress={() => handleCollectionSelectForUpdate(item.name)}
                  >
                    <View>
                      <Text
                        style={[
                          styles.collectionNameText,
                          { color: colorScheme === "dark" ? "#eee" : "#333" },
                        ]}
                      >
                        {item.name}{" "}
                        {item.hasPassword && (
                          <FontAwesome
                            name="lock"
                            size={16}
                            color={colorScheme === "dark" ? "#eee" : "#333"}
                          />
                        )}
                      </Text>
                      <Text
                        style={[
                          styles.collectionDateText,
                          { color: colorScheme === "dark" ? "#bbb" : "#666" },
                        ]}
                      >
                        Last updated: {formatDate(item.lastUpdated)}
                      </Text>
                    </View>
                    <FontAwesome
                      name="chevron-right"
                      size={16}
                      color={colorScheme === "dark" ? "#ccc" : "#888"}
                    />
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text
                    style={{
                      textAlign: "center",
                      marginVertical: 20,
                      color: colorScheme === "dark" ? "#fff" : "#000",
                    }}
                  >
                    No collections found to update.
                  </Text>
                }
              />
            )}
            <TouchableOpacity
              style={[styles.button, styles.closeButton, { marginTop: 10 }]}
              onPress={() => {
                setCollectionsModalVisible(false);
                setSaveOptionsModalVisible(true); // Go back to save options
              }}
            >
              <FontAwesome name="times" size={16} color="white" />
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Web: Password Protection Prompt */}
      {Platform.OS === "web" && savePasswordPromptVisible && (
        <Modal
          transparent={true}
          visible={savePasswordPromptVisible}
          onRequestClose={() => {
            setSavePasswordPromptVisible(false);
            onClose(); // Abort entire save
          }}
        >
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalView,
                { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
              ]}
            >
              <Text
                style={[
                  styles.modalTitle,
                  { color: colorScheme === "dark" ? "#fff" : "#000" },
                ]}
              >
                Password Protection
              </Text>
              <Text
                style={{
                  marginBottom: 20,
                  textAlign: "center",
                  color: colorScheme === "dark" ? "#fff" : "#000",
                }}
              >
                Do you want to password protect this collection "
                {collectionName}"?
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => handlePasswordChoiceForWeb(false)}
                >
                  <FontAwesome name="times" size={16} color="white" />
                  <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={() => handlePasswordChoiceForWeb(true)}
                >
                  <FontAwesome name="lock" size={16} color="white" />
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Web/Android: Password Entry Dialog for Saving */}
      {savePasswordDialogVisible && (
        <Modal
          transparent={true}
          visible={savePasswordDialogVisible}
          onRequestClose={() => {
            setSavePasswordDialogVisible(false);
            setPassword("");
            onClose(); // Abort entire save
          }}
        >
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalView,
                { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
              ]}
            >
              <Text
                style={[
                  styles.modalTitle,
                  { color: colorScheme === "dark" ? "#fff" : "#000" },
                ]}
              >
                Set Password
              </Text>
              <Text
                style={{
                  marginBottom: 15,
                  textAlign: "center",
                  color: colorScheme === "dark" ? "#fff" : "#000",
                }}
              >
                Enter a password for collection "{collectionName}":
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.collectionInput,
                    {
                      color: colorScheme === "dark" ? "white" : "black",
                      borderColor: colorScheme === "dark" ? "#555" : "#ccc",
                      flex: 1,
                      marginBottom: 0,
                    },
                  ]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor={
                    colorScheme === "dark" ? "#aaa" : "#888"
                  }
                  secureTextEntry={!showPassword}
                  autoFocus
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                    color={colorScheme === "dark" ? "#aaa" : "#888"}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setSavePasswordDialogVisible(false);
                    setPassword("");
                    if (Platform.OS === "web") {
                      setSavePasswordPromptVisible(true); // Go back for web
                    } else {
                      onClose(); // Abort for Android if password entry is cancelled
                    }
                  }}
                >
                  <FontAwesome name="times" size={16} color="white" />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={() => handleWebOrAndroidPasswordSet(password)}
                >
                  <FontAwesome name="check" size={16} color="white" />
                  <Text style={styles.buttonText}>Set Password</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Web: Confirm Save Dialog */}
      {Platform.OS === "web" && confirmSaveDialogVisible && (
        <Modal
          transparent={true}
          visible={confirmSaveDialogVisible}
          onRequestClose={() => {
            setConfirmSaveDialogVisible(false);
            onClose(); // Abort entire save
          }}
        >
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalView,
                { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
              ]}
            >
              <Text
                style={[
                  styles.modalTitle,
                  { color: colorScheme === "dark" ? "#fff" : "#000" },
                ]}
              >
                Save to Cloud
              </Text>
              <Text
                style={{
                  marginBottom: 20,
                  textAlign: "center",
                  color: colorScheme === "dark" ? "#fff" : "#000",
                }}
              >
                Are you sure you want to save the current data to collection "
                {collectionName}"?
                {password
                  ? "\n\nThis collection will be password protected."
                  : ""}
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setConfirmSaveDialogVisible(false);
                    onClose(); // Abort entire save
                  }}
                >
                  <FontAwesome name="times" size={16} color="white" />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleWebConfirmSave}
                >
                  <FontAwesome name="check" size={16} color="white" />
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Web: Status Dialog */}
      {Platform.OS === "web" && statusDialogVisible && (
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
              <Text
                style={[
                  styles.modalTitle,
                  { color: colorScheme === "dark" ? "#fff" : "#000" },
                ]}
              >
                {statusDialogSuccess ? "Success" : "Error"}
              </Text>
              <Text
                style={{
                  marginBottom: 20,
                  textAlign: "center",
                  color: colorScheme === "dark" ? "#fff" : "#000",
                }}
              >
                {statusDialogMessage}
              </Text>
              <TouchableOpacity
                style={[
                  styles.button,
                  statusDialogSuccess
                    ? styles.confirmButton
                    : styles.cancelButton,
                ]}
                onPress={() => setStatusDialogVisible(false)}
              >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default SaveCloudSync;
