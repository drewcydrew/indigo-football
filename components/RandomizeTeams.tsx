import React, { useState } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Text, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNames, Player } from '../context/NamesContext'; // Import Player type

const RandomizeTeams = () => {
  const { names, setNames } = useNames();
  const [modalVisible, setModalVisible] = useState(false);
  const [numTeams, setNumTeams] = useState('2');

  const randomizeTeams = () => {
    const allPlayers = [...names.flat()].sort(() => Math.random() - 0.5);
    const teams: Player[][] = Array.from({ length: parseInt(numTeams, 10) }, () => []);
    allPlayers.forEach((player, index) => {
      teams[index % teams.length].push(player);
    });
    setNames(teams);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
        <Icon name="shuffle" size={40} color="#007bff" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Randomize Teams</Text>
            <TextInput
              style={styles.input}
              placeholder="Number of teams"
              value={numTeams}
              onChangeText={setNumTeams}
              keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={randomizeTeams} style={styles.button}>
                <Text style={styles.buttonText}>Randomize</Text>
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
  iconButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
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
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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

export default RandomizeTeams;
