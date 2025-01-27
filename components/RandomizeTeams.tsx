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
  algorithm: string;
  setAlgorithm: (value: string) => void;
}

interface RandomizeTeamsProps {
  showScores: boolean;
  setShowScores: (value: boolean) => void;
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



export const RandomizeTeamsSettingsIcon: React.FC<RandomizeTeamsSettingsProps> = ({ showScores, setShowScores, numTeams, setNumTeams, algorithm, setAlgorithm }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [localNumTeams, setLocalNumTeams] = useState(numTeams); // Local state for number of teams
  const colorScheme = useColorScheme(); // Get the current color scheme

  const handleNumTeamsChange = (value: number) => {
    setLocalNumTeams(value);
    setNumTeams(value); // Update parent state
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
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: colorScheme === 'dark' ? 'white' : 'black' }]}>Show Scores</Text>
              <Switch
                value={showScores}
                onValueChange={setShowScores}
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: colorScheme === 'dark' ? 'white' : 'black' }]}>Sort by score?</Text>
              <Switch
                value={algorithm === 'scores'}
                onValueChange={(val) => setAlgorithm(val ? 'scores' : 'players')}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.button}>
                <Text style={styles.buttonText}>OK</Text>
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

export function getRandomTeams(allPlayers: Player[], numTeams: number): Player[][] {
  const shuffle = (array: Player[]): Player[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  if (allPlayers.length === 0) return [];
  const shuffledPlayers = shuffle(allPlayers);
  const minPlayersPerTeam = Math.floor(allPlayers.length / numTeams);
  const extraPlayers = allPlayers.length % numTeams;
  
  const teams: Player[][] = Array(numTeams).fill([]).map(() => []);
  let currentIndex = 0;

  // First, distribute minimum players to each team
  for (let i = 0; i < numTeams; i++) {
    teams[i] = shuffledPlayers.slice(currentIndex, currentIndex + minPlayersPerTeam);
    currentIndex += minPlayersPerTeam;
  }

  // Then distribute extra players one by one
  for (let i = 0; i < extraPlayers; i++) {
    teams[i].push(shuffledPlayers[currentIndex + i]);
  }

  return teams;
}

export function getRandomTeamsByScores(players: Player[], numTeams: number): Player[][] {
  if (players.length === 0) return [];
  
  // Group and shuffle players by score as before
  const scoreGroups: { [key: number]: Player[] } = {};
  players.forEach(player => {
    if (!scoreGroups[player.score]) {
      scoreGroups[player.score] = [];
    }
    scoreGroups[player.score].push(player);
  });

  Object.values(scoreGroups).forEach(group => {
    for (let i = group.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [group[i], group[j]] = [group[j], group[i]];
    }
  });

  const sortedPlayers = Object.entries(scoreGroups)
    .sort(([scoreA], [scoreB]) => Number(scoreB) - Number(scoreA))
    .flatMap(([_, group]) => group);

  const teams: Player[][] = Array.from({ length: numTeams }, () => []);
  const teamScores = Array(numTeams).fill(0);

  // Distribute players to teams based on lowest total score
  sortedPlayers.forEach(player => {
    const minScoreIndex = teamScores.indexOf(Math.min(...teamScores));
    teams[minScoreIndex].push(player);
    teamScores[minScoreIndex] += player.score;
  });

  return teams;
}

const RandomizeTeams: React.FC<RandomizeTeamsProps> = ({ 
  showScores, 
  setShowScores
}) => {
  const { names, saveTeams } = useNames();
  const [numTeams, setNumTeams] = useState(2);
  const [algorithm, setAlgorithm] = useState('players');

  const randomizeTeams = () => {
    const allPlayers = [...names.flat()].filter(player => player.included);
    if (allPlayers.length === 0 || allPlayers.length % numTeams !== 0) {
      console.warn(`Cannot create ${numTeams} even teams with ${allPlayers.length} players`);
      return;
    }
    let teams: Player[][] = [];
    if (algorithm === 'scores') {
      teams = getRandomTeamsByScores(allPlayers, numTeams);
    } else {
      teams = getRandomTeams(allPlayers, numTeams);
    }
    saveTeams(teams);
  };

  
  return (
    <View style={styles.container}>
      <View style={styles.bottomLeft}>
        <RandomizeTeamsSettingsIcon showScores={showScores} setShowScores={setShowScores} setNumTeams={setNumTeams} numTeams={numTeams} algorithm={algorithm} setAlgorithm={setAlgorithm} />
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
