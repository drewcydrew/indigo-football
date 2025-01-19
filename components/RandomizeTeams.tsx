import React, { useState } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Text, useColorScheme, Switch } from 'react-native';
import Slider from '@react-native-community/slider'; // Import Slider component
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNames, Player } from '../context/NamesContext';

const RandomizeTeams = ({ showScores, setShowScores }: { showScores: boolean, setShowScores: (value: boolean) => void }) => {
  const { names, saveTeams } = useNames();
  const [modalVisible, setModalVisible] = useState(false);
  const [numTeams, setNumTeams] = useState(2);
  const [algorithm, setAlgorithm] = useState('scores'); // State to select algorithm
  const colorScheme = useColorScheme(); // Get the current color scheme

  const randomizeTeams = () => {
    const allPlayers = [...names.flat()].filter(player => player.included).sort(() => Math.random() - 0.5);
    const teams: Player[][] = Array.from({ length: numTeams }, () => []);

    if (algorithm === 'scores') {
      const teamScores = Array(numTeams).fill(0);
      allPlayers.forEach(player => {
        const minScoreIndex = teamScores.indexOf(Math.min(...teamScores));
        teams[minScoreIndex].push(player);
        teamScores[minScoreIndex] += player.score;
      });
    } else {
      allPlayers.forEach((player, index) => {
        teams[index % numTeams].push(player);
      });
    }

    saveTeams(teams);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={randomizeTeams}>
        <Icon name="shuffle" size={40} color="#007bff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
        <Icon name="settings" size={40} color="#007bff" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalView, { backgroundColor: colorScheme === 'dark' ? '#333' : '#fff' }]}>
            <Text style={styles.modalText}>Randomize Teams</Text>
            <Text>Number of Teams: {numTeams}</Text>
            <Slider
              value={numTeams}
              onValueChange={setNumTeams}
              minimumValue={2}
              maximumValue={6}
              step={1}
              style={styles.slider}
            />
            <Picker
              selectedValue={algorithm}
              style={styles.picker}
              onValueChange={(itemValue) => setAlgorithm(itemValue)}
              mode="dropdown"
            >
              <Picker.Item label="Evenly Distribute Scores" value="scores" />
              <Picker.Item label="Evenly Distribute Players" value="players" />
            </Picker>
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: colorScheme === 'dark' ? 'white' : 'black' }]}>Show Scores</Text>
              <Switch
                value={showScores}
                onValueChange={setShowScores}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={randomizeTeams} style={styles.button}>
                <Text style={styles.buttonText}>OK</Text>
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginHorizontal: 10,
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
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 10,
  },
  picker: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
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
