import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { useNames } from "../../context/NamesContext";
import { FontAwesome } from "@expo/vector-icons";
import PlayerModal from "../shared/PlayerModal";

const AddName: React.FC = () => {
  const { addName, updatePlayer } = useNames();
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();

  const handleSave = (name: string, score: number, bio: string) => {
    // First add the player with name and score
    addName(name, score);

    // If there's a bio, update the player immediately after adding
    if (bio) {
      // Small delay to ensure the player is added first
      setTimeout(() => {
        updatePlayer(name, name, score, bio, 0);
      }, 100);
    }
  };

  const isDark = colorScheme === "dark";

  return (
    <>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome
          name="plus"
          size={24}
          color={isDark ? "#00aaff" : "#007bff"}
        />
      </TouchableOpacity>

      <PlayerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        title="Add Player"
      />
    </>
  );
};

const styles = StyleSheet.create({
  addButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AddName;
