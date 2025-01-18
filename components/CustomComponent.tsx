import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Text, View } from './Themed';

const names = ['Alice', 'Bob', 'Charlie', 'David', 'Evey'];

const CustomComponent = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={names}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.text}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default CustomComponent; // Ensure default export
