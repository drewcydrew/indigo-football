import React, { useState } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Text } from 'react-native';
import { Slider } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNames, Player } from '../context/NamesContext';
import { CheckBox } from 'react-native-elements'; // Import CheckBox

const RandomizeTeams = ({ showScores, setShowScores }: { showScores: boolean, setShowScores: (value: boolean) => void }) => {
  const { names, saveTeams } = useNames();
  const [modalVisible, setModalVisible] = useState(false);
  const [numTeams, setNumTeams] = useState(2);
  const [algorithm, setAlgorithm] = useState('scores'); // State to select algorithm

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
          <View style={styles.modalView}>
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
            <CheckBox
              title="Show Scores"
              checked={showScores}
              onPress={() => setShowScores(!showScores)}
              // Use default parameters instead of defaultProps
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              textStyle={{ color: 'black' }} // Add default text color
            />
            <TouchableOpacity onPress={randomizeTeams} style={styles.button}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
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
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  slider: {
    width: '80%',
    marginVertical: 10,
  },
  picker: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
  button: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default RandomizeTeams;
