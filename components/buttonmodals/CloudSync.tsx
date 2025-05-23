import React, { useState, useEffect } from "react";
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
import { Feather } from "@expo/vector-icons";

const CloudSync = () => {
  const {
    saveToFirestore,
    loadFromFirestore,
    currentCollection,
    setCurrentCollection,
  } = useNames();
  const colorScheme = useColorScheme();
  const [collectionName, setCollectionName] = useState(currentCollection);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [isNewPassword, setIsNewPassword] = useState(false);

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

  // Save password dialog state
  const [savePasswordPromptVisible, setSavePasswordPromptVisible] =
    useState(false);
  const [savePasswordDialogVisible, setSavePasswordDialogVisible] =
    useState(false);

  // Password dialog for loading protected collections
  const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
  const [androidPasswordDialogVisible, setAndroidPasswordDialogVisible] =
    useState(false);

  const handleSaveToFirestore = async () => {
    setOptionsModalVisible(false);

    if (Platform.OS === "web") {
      // For Web, show the password prompt first
      setSavePasswordPromptVisible(true);
    } else {
      // For mobile, use Alert to ask about password protection
      Alert.alert(
        "Password Protection",
        "Do you want to password protect this collection?",
        [
          {
            text: "No",
            onPress: () => confirmSave(""),
          },
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
                      onPress: () => confirmSave(""),
                    },
                    {
                      text: "Set",
                      onPress: (password) => confirmSave(password || ""),
                    },
                  ],
                  "secure-text"
                );
              } else {
                // For Android, show our custom password input dialog
                setPassword("");
                setSavePasswordDialogVisible(true);
              }
            },
          },
        ]
      );
    }
  };

  const confirmSave = (pwd: string) => {
    if (Platform.OS === "web") {
      // For web, handle through the existing confirmation dialog
      setPassword(pwd);
      setConfirmDialogAction("save");
      setConfirmDialogVisible(true);
    } else {
      // For mobile, show confirmation alert
      Alert.alert(
        "Save to Cloud",
        `Are you sure you want to save the current data to collection "${collectionName}"?${
          pwd ? "\n\nThis collection will be password protected." : ""
        }`,
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
                await saveToFirestore(collectionName, pwd);
                Alert.alert(
                  "Success",
                  `Data saved to "${collectionName}" collection successfully${
                    pwd ? " (Password Protected)" : ""
                  }`
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

    try {
      // First check if this collection is password protected
      const checkResult = await checkIfPasswordProtected(collectionName);

      // If the collection doesn't exist, handle that specific case
      if (checkResult.notFound) {
        if (Platform.OS === "web") {
          setStatusDialogSuccess(false);
          setStatusDialogMessage(`Collection "${collectionName}" not found`);
          setStatusDialogVisible(true);
        } else {
          Alert.alert(
            "Collection Not Found",
            `The collection "${collectionName}" could not be found.`
          );
        }
        return;
      }

      if (checkResult.isPasswordProtected) {
        setIsPasswordRequired(true);
        if (Platform.OS === "web") {
          setPasswordDialogVisible(true);
        } else {
          promptForPassword();
        }
        return;
      }

      // If not password protected, proceed normally
      if (Platform.OS === "web") {
        setConfirmDialogAction("load");
        setConfirmDialogVisible(true);
      } else {
        confirmLoad();
      }
    } catch (error) {
      if (Platform.OS === "web") {
        setStatusDialogSuccess(false);
        setStatusDialogMessage("Failed to check collection");
        setStatusDialogVisible(true);
      } else {
        Alert.alert("Error", "Failed to check collection");
      }
    }
  };

  const handleAndroidPasswordSubmit = () => {
    setSavePasswordDialogVisible(false);
    confirmSave(password);
    setPassword("");
  };

  const handlePasswordChoiceForWeb = (usePassword: boolean) => {
    setSavePasswordPromptVisible(false);

    if (usePassword) {
      // Show password input dialog
      setPassword("");
      setSavePasswordDialogVisible(true);
    } else {
      // Proceed without password
      confirmSave("");
    }
  };

  const checkIfPasswordProtected = async (
    collectionName: string
  ): Promise<{ isPasswordProtected: boolean; notFound?: boolean }> => {
    try {
      const result = await loadFromFirestore(collectionName, null, true);
      return { isPasswordProtected: result.isPasswordProtected || false };
    } catch (error) {
      console.error("Error checking if password protected:", error);

      // Check if the error is specifically about the collection not being found
      if (
        error instanceof Error &&
        error.message.includes("No data found in collection")
      ) {
        return { isPasswordProtected: false, notFound: true };
      }

      throw error;
    }
  };

  const promptForPassword = () => {
    if (Platform.OS === "ios") {
      // iOS-specific prompt using Alert.prompt
      Alert.prompt(
        "Password Required",
        `Collection "${collectionName}" is password protected. Please enter the password:`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Load",
            onPress: async (password) => {
              if (!password) return;

              try {
                await loadWithPassword(password);
              } catch (error) {
                Alert.alert(
                  "Error",
                  "Incorrect password or failed to load data"
                );
              }
            },
          },
        ],
        "secure-text"
      );
    } else {
      // For Android, show our custom modal
      setAndroidPasswordDialogVisible(true);
    }
  };

  const loadWithPassword = async (pwd: string) => {
    try {
      setCurrentCollection(collectionName);
      await loadFromFirestore(collectionName, pwd);

      if (Platform.OS === "web") {
        setStatusDialogSuccess(true);
        setStatusDialogMessage(
          `Data loaded from "${collectionName}" collection successfully`
        );
        setStatusDialogVisible(true);
      } else {
        Alert.alert(
          "Success",
          `Data loaded from "${collectionName}" collection successfully`
        );
      }

      // Reset password field
      setPassword("");
    } catch (error) {
      if (Platform.OS === "web") {
        setStatusDialogSuccess(false);
        setStatusDialogMessage("Incorrect password or failed to load data");
        setStatusDialogVisible(true);
      } else {
        Alert.alert("Error", "Incorrect password or failed to load data");
      }
    }
  };

  const confirmLoad = () => {
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
              const errorMessage =
                error instanceof Error &&
                error.message.includes("No data found in collection")
                  ? `Collection "${collectionName}" not found`
                  : "Failed to load data from cloud";

              Alert.alert("Error", errorMessage);
            }
          },
        },
      ]
    );
  };

  const handleWebAction = async () => {
    try {
      setCurrentCollection(collectionName);

      if (confirmDialogAction === "load") {
        if (isPasswordRequired) {
          // Handle in password dialog separately
          return;
        }

        await loadFromFirestore(collectionName);
        setStatusDialogSuccess(true);
        setStatusDialogMessage(
          `Data loaded from "${collectionName}" collection successfully`
        );
      } else {
        await saveToFirestore(collectionName, password);
        setStatusDialogSuccess(true);
        setStatusDialogMessage(
          `Data saved to "${collectionName}" collection successfully${
            password ? " (Password Protected)" : ""
          }`
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

    // Reset password field
    setPassword("");
  };

  const handlePasswordSubmit = async () => {
    try {
      await loadWithPassword(password);
      setPasswordDialogVisible(false);
    } catch (error) {
      // Error handling is inside loadWithPassword
    }
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
                  : `Are you sure you want to save the current data to collection "${collectionName}"?${
                      password
                        ? "\n\nThis collection will be password protected."
                        : ""
                    }`}
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
      {/* Web password protection prompt */}
      {Platform.OS === "web" && (
        <Modal
          transparent={true}
          visible={savePasswordPromptVisible}
          onRequestClose={() => setSavePasswordPromptVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalView,
                { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
              ]}
            >
              <Text style={styles.modalTitle}>Password Protection</Text>
              <Text style={{ marginBottom: 20, textAlign: "center" }}>
                Do you want to password protect this collection?
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

      {/* Android password required dialog (for loading protected collections) */}
      <Modal
        transparent={true}
        visible={androidPasswordDialogVisible}
        onRequestClose={() => {
          setAndroidPasswordDialogVisible(false);
          setPassword("");
        }}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
            ]}
          >
            <Text style={styles.modalTitle}>Password Required</Text>
            <Text style={{ marginBottom: 15, textAlign: "center" }}>
              Collection "{collectionName}" is password protected. Please enter
              the password:
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
                placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"}
                secureTextEntry={!showPassword}
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
                  setAndroidPasswordDialogVisible(false);
                  setPassword("");
                }}
              >
                <FontAwesome name="times" size={16} color="white" />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={async () => {
                  try {
                    await loadWithPassword(password);
                    setAndroidPasswordDialogVisible(false);
                  } catch (error) {
                    // Error handling is in loadWithPassword
                  }
                }}
              >
                <FontAwesome name="check" size={16} color="white" />
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Web password required dialog */}
      {Platform.OS === "web" && (
        <Modal
          transparent={true}
          visible={passwordDialogVisible}
          onRequestClose={() => {
            setPasswordDialogVisible(false);
            setPassword("");
          }}
        >
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalView,
                { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
              ]}
            >
              <Text style={styles.modalTitle}>Password Required</Text>
              <Text style={{ marginBottom: 15, textAlign: "center" }}>
                Collection "{collectionName}" is password protected. Please
                enter the password:
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
                    setPasswordDialogVisible(false);
                    setPassword("");
                  }}
                >
                  <FontAwesome name="times" size={16} color="white" />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={handlePasswordSubmit}
                >
                  <FontAwesome name="check" size={16} color="white" />
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Web/Android password entry dialog */}
      <Modal
        transparent={true}
        visible={savePasswordDialogVisible}
        onRequestClose={() => {
          setSavePasswordDialogVisible(false);
          setPassword("");
        }}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
            ]}
          >
            <Text style={styles.modalTitle}>Set Password</Text>
            <Text style={{ marginBottom: 15, textAlign: "center" }}>
              Enter a password to protect your collection:
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
                placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"}
                secureTextEntry={!showPassword}
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
                  if (Platform.OS === "web") {
                    confirmSave("");
                  } else {
                    setPassword("");
                  }
                }}
              >
                <FontAwesome name="times" size={16} color="white" />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={() => {
                  if (Platform.OS === "web") {
                    setSavePasswordDialogVisible(false);
                    confirmSave(password);
                  } else {
                    handleAndroidPasswordSubmit();
                  }
                }}
              >
                <FontAwesome name="check" size={16} color="white" />
                <Text style={styles.buttonText}>Set</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    maxHeight: "80%",
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
    marginVertical: 5,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  eyeIcon: {
    padding: 8,
    position: "absolute",
    right: 5,
    height: "100%",
    justifyContent: "center",
  },
  helperText: {
    fontSize: 12,
    fontStyle: "italic",
    opacity: 0.7,
    marginTop: -8,
  },
});

export default CloudSync;
