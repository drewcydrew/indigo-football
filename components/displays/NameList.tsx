import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { Text } from "../Themed";
import { CheckBox } from "react-native-elements";
import { useNames } from "../../context/NamesContext";
import InfoDisplay from "../InfoDisplay";

interface Player {
  name: string;
  included: boolean;
}

const NameList = () => {
  const { names, togglePlayerIncluded, setAllIncluded } = useNames();
  const flatNames: Player[] = names.flat();
  const [allSelected, setAllSelected] = useState(false);
  const colorScheme = useColorScheme();

  const handleSelectAll = () => {
    setAllIncluded(!allSelected);
    setAllSelected(!allSelected);
  };

  const renderName = (player: Player) => (
    <TouchableOpacity
      style={styles.nameContainer}
      onPress={() => togglePlayerIncluded(player.name)}
      activeOpacity={0.7}
    >
      <CheckBox
        checked={player.included}
        onPress={() => togglePlayerIncluded(player.name)}
        textStyle={{ color: colorScheme === "dark" ? "white" : "black" }}
      />
      <Text style={[styles.text]} numberOfLines={1} ellipsizeMode="tail">
        {player.name}
      </Text>
    </TouchableOpacity>
  );

  const renderRow = ({ item }: { item: Player[] }) => (
    <View style={styles.row}>
      {item.map((player, index) => (
        <View key={index} style={styles.column}>
          {renderName(player)}
        </View>
      ))}
    </View>
  );

  const groupedNames = flatNames.reduce((result: Player[][], player, index) => {
    const rowIndex = Math.floor(index / 2);
    if (!result[rowIndex]) {
      result[rowIndex] = [];
    }
    result[rowIndex].push(player);
    return result;
  }, []);

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={groupedNames}
        renderItem={renderRow}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
      />

      <InfoDisplay
        title="Attendance"
        content="Use checkboxes to select players who are here at the moment (these are the players that will be used to generate teams on next page)"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: "relative",
    width: "100%",
    height: "100%",
  },
  container: {
    padding: 5,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    width: "100%",
  },
  column: {
    flex: 1,
    marginHorizontal: 2,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    width: "100%",
  },
  text: {
    fontSize: 17,
    lineHeight: 24,
    paddingLeft: 5,
    flex: 1,
    flexShrink: 1,
  },
  selectButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
    margin: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default NameList;
