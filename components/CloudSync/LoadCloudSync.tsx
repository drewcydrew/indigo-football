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
import Feather from "react-native-vector-icons/Feather"; // For eye icon
import { useNames } from "../../context/NamesContext"; // Adjust path as needed
// Assuming styles are in a shared file or you'll move them
import { styles } from "./CloudSyncStyles"; // Create or adjust this path

interface LoadCloudSyncProps {
  onClose: () => void;
  useNamesContext: ReturnType<typeof useNames>;
  colorScheme: "light" | "dark" | null | undefined;
}

const LoadCloudSync: React.FC<LoadCloudSyncProps> = ({
  onClose,
  useNamesContext,
  colorScheme,
}) => {
  const { loadFromFirestore, setCurrentCollection, listCollections } =
    useNamesContext;

  const [collectionName, setCollectionName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);

  // Dialog/Modal states
  const [passwordDialogVisible, setPasswordDialogVisible] = useState(false); // Web: enter password
  const [androidPasswordDialogVisible, setAndroidPasswordDialogVisible] =
    useState(false); // Android: enter password
  const [confirmLoadDialogVisible, setConfirmLoadDialogVisible] =
    useState(false); // Web: confirm load

  // Collections list
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

  const checkIfPasswordProtected = async (
    name: string
  ): Promise<{ isPasswordProtected: boolean; notFound?: boolean }> => {
    try {
      const result = await loadFromFirestore(name, null, true); // Check only
      return { isPasswordProtected: result.isPasswordProtected || false };
    } catch (error) {
      console.error("Error checking if password protected:", error);
      if (
        error instanceof Error &&
        error.message.includes("No data found in collection")
      ) {
        return { isPasswordProtected: false, notFound: true };
      }
      throw error; // Re-throw other errors
    }
  };

  const handleCollectionSelect = async (selectedCollection: string) => {
    setCollectionsModalVisible(false);
    setCollectionName(selectedCollection); // Set for use in password prompts/confirmation

    try {
      const checkResult = await checkIfPasswordProtected(selectedCollection);

      if (checkResult.notFound) {
        const message = `The collection "${selectedCollection}" could not be found.`;
        if (Platform.OS === "web") {
          showWebStatusDialog(message, false);
        } else {
          Alert.alert("Collection Not Found", message);
        }
        return;
      }

      if (checkResult.isPasswordProtected) {
        setIsPasswordRequired(true);
        setPassword(""); // Clear previous password
        if (Platform.OS === "web") {
          setTimeout(() => setPasswordDialogVisible(true), 100);
        } else {
          setTimeout(() => promptForPasswordMobile(selectedCollection), 100);
        }
      } else {
        setIsPasswordRequired(false);
        // If not password protected, proceed to confirmation
        if (Platform.OS === "web") {
          setConfirmLoadDialogVisible(true);
        } else {
          confirmLoadMobile(selectedCollection, false);
        }
      }
    } catch (error) {
      const message = "Failed to check collection status.";
      if (Platform.OS === "web") {
        showWebStatusDialog(message, false);
      } else {
        Alert.alert("Error", message);
      }
    }
  };

  const executeLoad = async (name: string, pwd?: string) => {
    try {
      setCurrentCollection(name);
      await loadFromFirestore(name, pwd);
      const successMessage = `Data loaded from "${name}" collection successfully`;
      if (Platform.OS === "web") {
        showWebStatusDialog(successMessage, true);
      } else {
        Alert.alert("Success", successMessage);
      }
      setPassword("");
      onClose(); // Close the load flow
    } catch (error) {
      let errorMessage = "Failed to load data from cloud";
      if (error instanceof Error) {
        if (error.message.includes("No data found in collection")) {
          errorMessage = `Collection "${name}" not found.`;
        } else if (error.message.includes("Incorrect password")) {
          errorMessage = "Incorrect password.";
        }
      }
      if (Platform.OS === "web") {
        showWebStatusDialog(errorMessage, false);
      } else {
        Alert.alert("Error", errorMessage);
      }
    }
  };

  const confirmLoadMobile = (name: string, isProtected: boolean) => {
    Alert.alert(
      "Load from Cloud",
      `This will replace your current data with the cloud version from collection "${name}". Are you sure?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Load",
          onPress: async () => {
            if (isProtected) {
              // This case should ideally be handled by promptForPasswordMobile directly
              // For safety, re-prompt if somehow reached here without password
              promptForPasswordMobile(name);
            } else {
              await executeLoad(name);
            }
          },
        },
      ]
    );
  };

  const promptForPasswordMobile = (name: string) => {
    if (Platform.OS === "ios") {
      Alert.prompt(
        "Password Required",
        `Collection "${name}" is password protected. Please enter the password:`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Load",
            onPress: async (pwd) => {
              if (pwd) await executeLoad(name, pwd);
            },
          },
        ],
        "secure-text"
      );
    } else {
      // Android
      setCollectionName(name); // Ensure collectionName is set for the dialog
      setAndroidPasswordDialogVisible(true);
    }
  };

  const handleAndroidPasswordSubmit = async () => {
    setAndroidPasswordDialogVisible(false);
    await executeLoad(collectionName, password);
  };

  const handleWebPasswordSubmit = async () => {
    setPasswordDialogVisible(false);
    await executeLoad(collectionName, password);
  };

  const handleWebConfirmLoad = async () => {
    setConfirmLoadDialogVisible(false);
    await executeLoad(
      collectionName,
      isPasswordRequired ? password : undefined
    );
  };

  // Initial action: show collections list
  useEffect(() => {
    setCollectionsModalVisible(true);
    fetchCollections();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <View>
      {/* Collections Modal */}
      <Modal
        transparent={true}
        visible={collectionsModalVisible}
        onRequestClose={() => {
          setCollectionsModalVisible(false);
          onClose(); // Close flow if collection modal is dismissed
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
              Select Collection to Load
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
                    onPress={() => handleCollectionSelect(item.name)}
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
                    No collections found.
                  </Text>
                }
              />
            )}
            <TouchableOpacity
              style={[styles.button, styles.closeButton, { marginTop: 10 }]}
              onPress={() => {
                setCollectionsModalVisible(false);
                onClose();
              }}
            >
              <FontAwesome name="times" size={16} color="white" />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Web: Password Dialog for Loading */}
      {Platform.OS === "web" && passwordDialogVisible && (
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
              <Text
                style={[
                  styles.modalTitle,
                  { color: colorScheme === "dark" ? "#fff" : "#000" },
                ]}
              >
                Password Required
              </Text>
              <Text
                style={{
                  marginBottom: 15,
                  textAlign: "center",
                  color: colorScheme === "dark" ? "#fff" : "#000",
                }}
              >
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
                    setPasswordDialogVisible(false);
                    setPassword("");
                  }}
                >
                  <FontAwesome name="times" size={16} color="white" />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleWebPasswordSubmit}
                >
                  <FontAwesome name="check" size={16} color="white" />
                  <Text style={styles.buttonText}>Load</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Android: Password Dialog for Loading */}
      {Platform.OS !== "web" && androidPasswordDialogVisible && (
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
              <Text
                style={[
                  styles.modalTitle,
                  { color: colorScheme === "dark" ? "#fff" : "#000" },
                ]}
              >
                Password Required
              </Text>
              <Text
                style={{
                  marginBottom: 15,
                  textAlign: "center",
                  color: colorScheme === "dark" ? "#fff" : "#000",
                }}
              >
                Collection "{collectionName}" is password protected. Please
                enter the password:
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.collectionInput, // Ensure this style is defined
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
                  style={styles.eyeIcon} // Ensure this style is defined
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
                  onPress={handleAndroidPasswordSubmit}
                >
                  <FontAwesome name="check" size={16} color="white" />
                  <Text style={styles.buttonText}>Load</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Web: Confirm Load Dialog (for non-password protected or after password entry) */}
      {Platform.OS === "web" && confirmLoadDialogVisible && (
        <Modal
          transparent={true}
          visible={confirmLoadDialogVisible}
          onRequestClose={() => setConfirmLoadDialogVisible(false)}
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
                Load from Cloud
              </Text>
              <Text
                style={{
                  marginBottom: 20,
                  textAlign: "center",
                  color: colorScheme === "dark" ? "#fff" : "#000",
                }}
              >
                This will replace your current data with the cloud version from
                collection "{collectionName}". Are you sure?
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setConfirmLoadDialogVisible(false)}
                >
                  <FontAwesome name="times" size={16} color="white" />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleWebConfirmLoad}
                >
                  <FontAwesome name="check" size={16} color="white" />
                  <Text style={styles.buttonText}>Load</Text>
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

export default LoadCloudSync;
