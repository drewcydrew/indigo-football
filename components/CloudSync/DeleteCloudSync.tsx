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
import { useNames } from "../../context/NamesContext";
import { styles } from "./CloudSyncStyles";

interface DeleteCloudSyncProps {
  onClose: () => void;
  useNamesContext: ReturnType<typeof useNames>;
  colorScheme: "light" | "dark" | null | undefined;
}

const DeleteCloudSync: React.FC<DeleteCloudSyncProps> = ({
  onClose,
  useNamesContext,
  colorScheme,
}) => {
  const {
    deleteFromFirestore,
    currentCollection,
    listCollections,
    loadFromFirestore,
  } = useNamesContext;

  const [collectionName, setCollectionName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);

  // Dialog/Modal states
  const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
  const [androidPasswordDialogVisible, setAndroidPasswordDialogVisible] =
    useState(false);
  const [confirmDeleteDialogVisible, setConfirmDeleteDialogVisible] =
    useState(false);

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
      // Filter out demo teams that shouldn't be deleted
      const demoTeams = [
        "tottenham hotspurs",
        "ac milan",
        "celtic fc",
        "real madrid",
      ];
      const filteredCollections = availableCollections.filter(
        (collection) => !demoTeams.includes(collection.name.toLowerCase())
      );
      setCollections(filteredCollections);
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
      const result = await loadFromFirestore(name, null, true);
      return { isPasswordProtected: result.isPasswordProtected || false };
    } catch (error) {
      console.error("Error checking if password protected:", error);
      if (
        error instanceof Error &&
        error.message.includes("No data found in collection")
      ) {
        return { isPasswordProtected: false, notFound: true };
      }
      throw error;
    }
  };

  const handleCollectionSelect = async (selectedCollection: string) => {
    setCollectionsModalVisible(false);
    setCollectionName(selectedCollection);

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
        setPassword("");
        if (Platform.OS === "web") {
          setTimeout(() => setPasswordDialogVisible(true), 100);
        } else {
          setTimeout(() => promptForPasswordMobile(selectedCollection), 100);
        }
      } else {
        setIsPasswordRequired(false);
        if (Platform.OS === "web") {
          setConfirmDeleteDialogVisible(true);
        } else {
          confirmDeleteMobile(selectedCollection, false);
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

  const executeDelete = async (name: string, pwd?: string) => {
    try {
      await deleteFromFirestore(name, pwd);
      const successMessage = `Collection "${name}" deleted successfully`;
      if (Platform.OS === "web") {
        showWebStatusDialog(successMessage, true);
      } else {
        Alert.alert("Success", successMessage);
      }
      setPassword("");
      onClose();
    } catch (error) {
      let errorMessage = "Failed to delete collection";
      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          errorMessage = `Collection "${name}" not found.`;
        } else if (error.message.includes("Incorrect password")) {
          errorMessage = "Incorrect password.";
        } else if (error.message.includes("Cannot delete demo collections")) {
          errorMessage = "Cannot delete demo collections.";
        }
      }
      if (Platform.OS === "web") {
        showWebStatusDialog(errorMessage, false);
      } else {
        Alert.alert("Error", errorMessage);
      }
    }
  };

  const confirmDeleteMobile = (name: string, isProtected: boolean) => {
    Alert.alert(
      "Delete Collection",
      `Are you sure you want to permanently delete the collection "${name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (isProtected) {
              promptForPasswordMobile(name);
            } else {
              await executeDelete(name);
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
            text: "Delete",
            style: "destructive",
            onPress: async (pwd) => {
              if (pwd) await executeDelete(name, pwd);
            },
          },
        ],
        "secure-text"
      );
    } else {
      setCollectionName(name);
      setAndroidPasswordDialogVisible(true);
    }
  };

  const handleAndroidPasswordSubmit = async () => {
    setAndroidPasswordDialogVisible(false);
    await executeDelete(collectionName, password);
  };

  const handleWebPasswordSubmit = async () => {
    setPasswordDialogVisible(false);
    await executeDelete(collectionName, password);
  };

  const handleWebConfirmDelete = async () => {
    setConfirmDeleteDialogVisible(false);
    await executeDelete(
      collectionName,
      isPasswordRequired ? password : undefined
    );
  };

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
              Select Collection to Delete
            </Text>
            <Text
              style={{
                marginBottom: 15,
                textAlign: "center",
                color: colorScheme === "dark" ? "#ff6b6b" : "#d32f2f",
                fontWeight: "500",
              }}
            >
              ⚠️ This action cannot be undone
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
                      name="trash"
                      size={16}
                      color={colorScheme === "dark" ? "#ff6b6b" : "#d32f2f"}
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
                    No collections available for deletion.
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

      {/* Web: Password Dialog */}
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
                enter the password to delete:
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
                  style={[styles.button, styles.deleteButton]}
                  onPress={handleWebPasswordSubmit}
                >
                  <FontAwesome name="trash" size={16} color="white" />
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Android: Password Dialog */}
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
                enter the password to delete:
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
                    setAndroidPasswordDialogVisible(false);
                    setPassword("");
                  }}
                >
                  <FontAwesome name="times" size={16} color="white" />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={handleAndroidPasswordSubmit}
                >
                  <FontAwesome name="trash" size={16} color="white" />
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Web: Confirm Delete Dialog */}
      {Platform.OS === "web" && confirmDeleteDialogVisible && (
        <Modal
          transparent={true}
          visible={confirmDeleteDialogVisible}
          onRequestClose={() => setConfirmDeleteDialogVisible(false)}
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
                Delete Collection
              </Text>
              <Text
                style={{
                  marginBottom: 20,
                  textAlign: "center",
                  color: colorScheme === "dark" ? "#fff" : "#000",
                }}
              >
                Are you sure you want to permanently delete the collection "
                {collectionName}"? This action cannot be undone.
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setConfirmDeleteDialogVisible(false)}
                >
                  <FontAwesome name="times" size={16} color="white" />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={handleWebConfirmDelete}
                >
                  <FontAwesome name="trash" size={16} color="white" />
                  <Text style={styles.buttonText}>Delete</Text>
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

export default DeleteCloudSync;
