import React, { useState } from "react";
import { View, FlatList, StyleSheet, Text, useColorScheme } from "react-native";
import { CheckBox } from "react-native-elements";
import { useNames } from "../../context/NamesContext";

interface Player {
  name: string;
  included: boolean;
}

const NameList = () => {
  const { names, togglePlayerIncluded, setAllIncluded } = useNames();
  const flatNames: Player[] = names.flat();
  const [allSelected, setAllSelected] = useState(false);
  const colorScheme = useColorScheme(); // Get the current color scheme

  const handleSelectAll = () => {
    setAllIncluded(!allSelected);
    setAllSelected(!allSelected);
  };

  console.log("Rendering name list:"); // Debugging line

  const renderName = (player: Player) => (
    <View style={styles.nameContainer}>
      <CheckBox
        checked={player.included}
        onPress={() => togglePlayerIncluded(player.name)}
        //checkedIcon="dot-circle-o"
        //uncheckedIcon="circle-o"
        textStyle={{ color: colorScheme === "dark" ? "white" : "black" }}
      />
      <Text
        style={[
          styles.text,
          { color: colorScheme === "dark" ? "white" : "black" },
        ]}
      >
        {player.name}
      </Text>
    </View>
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
    <View>
      <FlatList
        data={groupedNames}
        renderItem={renderRow}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    width: "100%", // Ensure full width
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    width: "100%", // Ensure full width
  },
  column: {
    flex: 1,
    marginHorizontal: 2,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
  },
  text: {
    fontSize: 17,
    lineHeight: 24,
    paddingLeft: 5,
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
