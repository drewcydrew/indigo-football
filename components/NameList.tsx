import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import AddName from './AddName';

const initialNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];

const NameList = () => {
  const [names, setNames] = useState(initialNames);

  const addName = (name: string) => {
    setNames([...names, name]);
  };

  return (
    <View style={styles.container}>
      <AddName onAdd={addName} />
      {names.map((name, index) => (
        <Text key={index} style={styles.text}>
          • {name}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  text: {
    fontSize: 17,
    lineHeight: 24,
    paddingVertical: 5,
  },
});

export default NameList; // Ensure default export
