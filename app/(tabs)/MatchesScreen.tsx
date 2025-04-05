import React, { useState } from "react";
import { StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import TeamSplitter from "@/components/displays/TeamSplitter"; // Import TeamSplitter
import { useNames } from "../../context/NamesContext";

export default function MatchesScreen() {
  const { showScores } = useNames(); // State to toggle scores

  return (
    <View style={styles.container}>
      <TeamSplitter showScores={showScores} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Ensure full width
  },
});
