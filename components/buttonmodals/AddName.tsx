import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
  useColorScheme,
  Keyboard,
} from "react-native";
import { Text } from "../Themed";
import { FontAwesome } from "@expo/vector-icons";
import { useNames } from "@/context/NamesContext";

const AddName = () => {
  const [name, setName] = useState("");
  const [score, setScore] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const { addName } = useNames();

  const handleAdd = () => {
    if (name.trim()) {
      addName(name, score);
      setName("");
      setScore(1);
      setModalVisible(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <FontAwesome name="plus-circle" size={40} color="#007bff" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
            ]}
          >
            <Text style={styles.modalTitle}>Add New Player</Text>
            <TextInput
              style={[
                styles.input,
                { color: colorScheme === "dark" ? "white" : "black" },
                { borderColor: colorScheme === "dark" ? "#555" : "#ccc" },
              ]}
              placeholder="Enter name"
              placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"} // Changed #999 to #888
              value={name}
              onChangeText={setName}
              autoFocus={true} // Added autoFocus
            />
            <Text
              style={[
                styles.scoreLabel,
                { color: colorScheme === "dark" ? "white" : "black" },
              ]}
            >
              Score: {score}
            </Text>
            <View style={styles.scoreButtonsContainer}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.scoreButton,
                    {
                      backgroundColor:
                        colorScheme === "dark"
                          ? score === s
                            ? "#007BFF"
                            : "#555"
                          : score === s
                          ? "#007BFF"
                          : "#f0f0f0",
                      borderColor:
                        colorScheme === "dark"
                          ? score === s
                            ? "#0056b3"
                            : "#777"
                          : score === s
                          ? "#0056b3"
                          : "#ccc",
                    },
                    score === s && styles.scoreButtonActive,
                  ]}
                  onPress={() => setScore(s)}
                >
                  <Text
                    style={[
                      styles.scoreButtonText,
                      {
                        color:
                          colorScheme === "dark"
                            ? "white"
                            : score === s
                            ? "white"
                            : "black",
                      },
                      score === s && styles.scoreButtonTextActive,
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleAdd}
                style={[styles.button, styles.saveButton]}
              >
                <FontAwesome name="check" size={16} color="white" />
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.button, styles.cancelButton]}
              >
                <FontAwesome name="times" size={16} color="white" />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 300,
    padding: 20,
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
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  scoreLabel: {
    alignSelf: "flex-start",
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
  },
  scoreButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  scoreButton: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
  },
  scoreButtonActive: {
    // backgroundColor is handled dynamically based on colorScheme
    // borderColor is handled dynamically based on colorScheme
  },
  scoreButtonText: {
    fontSize: 18,
    fontWeight: "500",
  },
  scoreButtonTextActive: {
    // color is handled dynamically based on colorScheme
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#607D8B",
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  slider: {
    width: "100%",
    height: 40,
    marginVertical: 10,
  },
});

export default AddName;
