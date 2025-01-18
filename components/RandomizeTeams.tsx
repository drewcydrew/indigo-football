import React, { useState } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Text, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNames, Player } from '../context/NamesContext'; // Import Player type
import { CheckBox } from 'react-native-elements'; // Import CheckBox

const RandomizeTeams = ({ showScores, setShowScores }: { showScores: boolean, setShowScores: (value: boolean) => void }) => {
  const { names, saveTeams } = useNames();
  const [modalVisible, setModalVisible] = useState(false);
  const [numTeams, setNumTeams] = useState('2');
  const [algorithm, setAlgorithm] = useState('scores'); // State to select algorithm

  const randomizeTeams = () => {
    const allPlayers = [...names.flat()].filter(player => player.included).sort(() => Math.random() - 0.5);
    const teams: Player[][] = Array.from({ length: parseInt(numTeams, 10) }, () => []);

    if (algorithm === 'scores') {
      const teamScores = Array(parseInt(numTeams, 10)).fill(0);
      allPlayers.forEach(player => {
        const minScoreIndex = teamScores.indexOf(Math.min(...teamScores));
        teams[minScoreIndex].push(player);
        teamScores[minScoreIndex] += player.score;
      });
    } else {
      allPlayers.forEach((player, index) => {
        teams[index % parseInt(numTeams, 10)].push(player);
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
            <TextInput
              style={styles.input}
              placeholder="Number of teams"
              value={numTeams}
              onChangeText={setNumTeams}
              keyboardType="numeric"
              // Use default parameters instead of defaultProps
              placeholderTextColor="#888"
            />
            <Picker
              selectedValue={algorithm}
              style={styles.picker}
              onValueChange={(itemValue) => setAlgorithm(itemValue)}
              // Use default parameters instead of defaultProps
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
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  picker: {
    width: '100%',
    height: 50,
    marginVertical: 10,
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
