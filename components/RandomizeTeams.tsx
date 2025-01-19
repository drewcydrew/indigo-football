import React, { useState } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Text, useColorScheme, Switch, Button, Platform } from 'react-native';
import Slider from '@react-native-community/slider'; // Import Slider component
import Icon from 'react-native-vector-icons/Ionicons';
import { useNames, Player } from '../context/NamesContext';

interface RandomizeTeamsSettingsProps {
  showScores: boolean;
  setShowScores: (value: boolean) => void;
  numTeams: number; // Add numTeams prop
  setNumTeams: (value: number) => void; // Add setNumTeams prop
}

interface RandomizeTeamsButtonProps {
  onRandomize: () => void;
}

export const RandomizeTeamsSettings: React.FC<RandomizeTeamsSettingsProps> = ({ showScores, setShowScores }) => {
  return (
    <View style={styles.settingsContainer}>
      <Text>Show Scores</Text>
      <Switch
        value={showScores}
        onValueChange={setShowScores}
      />
    </View>
  );
};

export const RandomizeTeamsButton: React.FC<RandomizeTeamsButtonProps> = ({ onRandomize }) => {
  return (
    <Button title="Randomize Teams" onPress={onRandomize} />
  );
};

export const RandomizeTeamsSettingsIcon: React.FC<RandomizeTeamsSettingsProps> = ({ showScores, setShowScores, numTeams, setNumTeams }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [localNumTeams, setLocalNumTeams] = useState(numTeams); // Local state for number of teams
  const [algorithm, setAlgorithm] = useState('scores'); // State to select algorithm
  const [dropdownVisible, setDropdownVisible] = useState(false); // State to toggle dropdown visibility
  const colorScheme = useColorScheme(); // Get the current color scheme

  const handleNumTeamsChange = (value: number) => {
    setLocalNumTeams(value);
    setNumTeams(value); // Update parent state
  };

  const handleAlgorithmChange = (value: string) => {
    setAlgorithm(value);
    setDropdownVisible(false); // Hide dropdown after selection
  };

  return (
    <View style={styles.container}>
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
            <Text>Number of Teams: {localNumTeams}</Text>
            <Slider
              value={localNumTeams}
              onValueChange={handleNumTeamsChange}
              minimumValue={2}
              maximumValue={6}
              step={1}
              style={styles.slider}
            />
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Algorithm</Text>
              <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownVisible(!dropdownVisible)}>
                <Text style={styles.dropdownText}>
                  {algorithm === 'scores' ? 'Evenly Distribute Scores' : 'Evenly Distribute Players'}
                </Text>
              </TouchableOpacity>
              {dropdownVisible && (
                <View style={styles.dropdownOptions}>
                  <TouchableOpacity style={styles.dropdownOption} onPress={() => handleAlgorithmChange('scores')}>
                    <Text style={styles.dropdownOptionText}>Evenly Distribute Scores</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownOption} onPress={() => handleAlgorithmChange('players')}>
                    <Text style={styles.dropdownOptionText}>Evenly Distribute Players</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: colorScheme === 'dark' ? 'white' : 'black' }]}>Show Scores</Text>
              <Switch
                value={showScores}
                onValueChange={setShowScores}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.button}>
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

export const RandomizeTeamsRandomizeIcon: React.FC<RandomizeTeamsButtonProps> = ({ onRandomize }) => {
  return (
    <TouchableOpacity style={styles.iconButton} onPress={onRandomize}>
      <Icon name="shuffle" size={40} color="#007bff" />
    </TouchableOpacity>
  );
};

const RandomizeTeams = ({ showScores, setShowScores }: { showScores: boolean, setShowScores: (value: boolean) => void }) => {
  const { names, saveTeams } = useNames();
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.bottomLeft}>
        <RandomizeTeamsSettingsIcon showScores={showScores} setShowScores={setShowScores} setNumTeams={setNumTeams} numTeams={numTeams} />
      </View>
      <View style={styles.bottomRight}>
        <RandomizeTeamsRandomizeIcon onRandomize={randomizeTeams} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
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
  dropdownContainer: {
    width: '100%',
    marginVertical: 10,
  },
  dropdownLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  dropdown: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 5,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownOptions: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  dropdownOption: {
    padding: 10,
  },
  dropdownOptionText: {
    fontSize: 16,
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
  settingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  bottomRight: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default RandomizeTeams;
