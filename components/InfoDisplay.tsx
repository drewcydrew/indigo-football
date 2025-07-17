import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "./Themed";

interface InfoDisplayProps {
  title?: string;
  content: string | React.ReactNode;
}

const InfoDisplay: React.FC<InfoDisplayProps> = ({
  title = "Information",
  content,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Get theme colors
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    closeModal();
  };

  // Don't render the button if it's been dismissed
  if (isDismissed) {
    return null;
  }

  return (
    <>
      {/* Floating Info Button */}
      <TouchableOpacity
        style={[
          styles.floatingButton,
          { backgroundColor, borderColor: tintColor },
        ]}
        onPress={openModal}
      >
        <Ionicons name="information-circle" size={28} color={tintColor} />
      </TouchableOpacity>

      {/* Info Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor, borderColor: tintColor },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: textColor }]}>
                  {title}
                </Text>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={textColor} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
              >
                {typeof content === "string" ? (
                  <Text style={[styles.modalText, { color: textColor }]}>
                    {content}
                  </Text>
                ) : (
                  content
                )}
              </ScrollView>

              {/* Dismiss button in footer */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.dismissButton, { backgroundColor: tintColor }]}
                  onPress={handleDismiss}
                >
                  <Text
                    style={[styles.dismissText, { color: backgroundColor }]}
                  >
                    Don't Show Again
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    borderWidth: 1,
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
    maxHeight: Dimensions.get("window").height * 0.7,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  closeButton: {
    padding: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  modalBody: {
    paddingHorizontal: 20,
    flex: 1,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
  },
  modalFooter: {
    padding: 20,
    paddingTop: 16,
    alignItems: "center",
  },
  dismissButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  dismissText: {
    fontWeight: "500",
    fontSize: 14,
  },
});

export default InfoDisplay;
