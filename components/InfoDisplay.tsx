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
        style={[styles.floatingButton, { backgroundColor, borderColor: tintColor }]} 
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
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor, borderColor: tintColor }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>{title}</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {typeof content === "string" ? (
                <Text style={[styles.modalText, { color: textColor }]}>{content}</Text>
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
                <Text style={[styles.dismissText, { color: backgroundColor }]}>Don't Show Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 20,  // Changed from top: 20 to bottom: 20
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    borderWidth: 1,
    borderRadius: 10,
    width: "90%",
    maxWidth: 500,
    maxHeight: "80%",
    padding: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 16,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
  },
  modalFooter: {
    padding: 16,
    alignItems: "center",
  },
  dismissButton: {
    padding: 10,
    borderRadius: 5,
  },
  dismissText: {
    fontWeight: "500",
    fontSize: 14,
    paddingHorizontal: 10,
  },
});

export default InfoDisplay;