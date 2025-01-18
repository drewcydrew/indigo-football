import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, View, Modal } from 'react-native';

const AddName = ({ onAdd }: { onAdd: (name: string) => void }) => {
  const [name, setName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name);
      setName('');
      setModalVisible(false);
    }
  };

  return (
    <View>
      <Button title="Add Player" onPress={() => setModalVisible(true)} />
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
            <Button title="Add" onPress={handleAdd} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
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
});

export default AddName;
