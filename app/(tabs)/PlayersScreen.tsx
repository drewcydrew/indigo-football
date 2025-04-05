import { StyleSheet } from "react-native";
import { View } from "@/components/Themed";
import PlayerDisplay from "@/components/displays/PlayerDisplay";

export default function PlayerScreen() {
  return (
    <View style={styles.container}>
      <PlayerDisplay />
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
