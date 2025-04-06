import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
  useColorScheme,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text } from "../Themed";
import { FontAwesome } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
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
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
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
                placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#999"}
                value={name}
                onChangeText={setName}
              />
              <Text>Score: {score}</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={score}
                onValueChange={setScore}
              />
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
        </TouchableWithoutFeedback>
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
