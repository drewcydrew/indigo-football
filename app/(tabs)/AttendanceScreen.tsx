import { StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import NameList from "@/components/displays/NameList";

export default function AttendanceScreen() {
  return (
    <View style={styles.container}>
      <NameList />
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
