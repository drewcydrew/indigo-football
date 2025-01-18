import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Modal, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure correct import

const AddName = ({ onAdd }: { onAdd: (name: string, score: number) => void }) => {
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleAdd = () => {
    const parsedScore = parseInt(score, 10);
    if (name.trim() && !isNaN(parsedScore)) {
      onAdd(name, parsedScore);
      setName('');
      setScore('');
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
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter score"
              value={score}
              onChangeText={setScore}
              keyboardType="numeric"
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
    backgroundColor: 'white',
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
});

export default AddName;
