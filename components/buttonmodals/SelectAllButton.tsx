import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useNames } from "../../context/NamesContext";
import Icon from "react-native-vector-icons/Ionicons";

const SelectAllButton = () => {
  const { names, setAllIncluded } = useNames();
  const [allSelected, setAllSelected] = useState(false);

  // Check if all players are currently selected
  useEffect(() => {
    const flatNames = names.flat();
    const isAllSelected =
      flatNames.length > 0 && flatNames.every((player) => player.included);
    setAllSelected(isAllSelected);
  }, [names]);

  const handleSelectAll = () => {
    setAllIncluded(!allSelected);
    setAllSelected(!allSelected);
  };

  return (
    <TouchableOpacity
      onPress={handleSelectAll}
      style={styles.container}
      activeOpacity={0.7}
    >
      <Icon
        name={allSelected ? "ios-close-circle" : "ios-checkmark-circle"}
        size={22}
        color="#007bff"
      />
      <Text style={styles.buttonText}>
        {allSelected ? "Deselect All" : "Select All"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(0,123,255,0.1)",
    borderRadius: 20,
    marginHorizontal: 10,
    marginVertical: 5,
    paddingLeft: 10,
  },
  buttonText: {
    color: "#007bff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
    marginRight: 2,
  },
});

export default SelectAllButton;
