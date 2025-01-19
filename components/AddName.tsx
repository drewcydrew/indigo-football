import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Modal, TouchableOpacity, Text, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure correct import
import Slider from '@react-native-community/slider'; // Import Slider component

const AddName = ({ onAdd }: { onAdd: (name: string, score: number) => void }) => {
  const [name, setName] = useState('');
  const [score, setScore] = useState(1); // Initialize score as a number
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme(); // Get the current color scheme

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name, score);
      setName('');
      setScore(1);
      setModalVisible(false);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Icon name="add-circle" size={40} color="#007bff" /> 
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalView, { backgroundColor: colorScheme === 'dark' ? '#333' : '#fff' }]}>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              value={name}
              onChangeText={setName}
            />
            <Text>Score: {score}</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={score}
              onValueChange={setScore}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleAdd} style={styles.button}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.button}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 10,
  },
});

export default AddName;
