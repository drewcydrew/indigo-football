import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import { useNames } from '../context/NamesContext';

const NameList = () => {
  const { names } = useNames();

  return (
    <View style={styles.container}>
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
