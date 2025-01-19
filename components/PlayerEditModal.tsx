import React from 'react';
import { StyleSheet, View, Modal, TextInput, Button, TouchableOpacity, useColorScheme } from 'react-native';
import { Text } from './Themed';
import Slider from '@react-native-community/slider'; // Import Slider component
import { Player } from '../context/NamesContext';

interface PlayerEditModalProps {
  visible: boolean;
  player: Player | null;
  onClose: () => void;
  onSave: (name: string, score: number, bio: string, matches: number) => void;
}

const PlayerEditModal: React.FC<PlayerEditModalProps> = ({ visible, player, onClose, onSave }) => {
  const [editedName, setEditedName] = React.useState(player?.name || '');
  const [editedScore, setEditedScore] = React.useState(player?.score || 1);
  const [editedBio, setEditedBio] = React.useState(player?.bio || '');
  const [editedMatches, setEditedMatches] = React.useState(player?.matches || 0);
  const colorScheme = useColorScheme(); // Get the current color scheme

  React.useEffect(() => {
    if (player) {
      setEditedName(player.name);
      setEditedScore(player.score);
      setEditedBio(player.bio);
      setEditedMatches(player.matches);
    }
  }, [player]);

  const handleSave = () => {
    onSave(editedName, editedScore, editedBio, editedMatches);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalView, { backgroundColor: colorScheme === 'dark' ? '#333' : '#fff' }]}>
          <Text>Edit Player</Text>
          <TextInput
            style={styles.input}
            value={editedName}
            onChangeText={setEditedName}
            placeholder="Name"
          />
          <Text>Score: {editedScore}</Text>
          <Slider
            value={editedScore}
            onValueChange={setEditedScore}
            minimumValue={1}
            maximumValue={5}
            step={1}
            style={styles.slider}
          />
          <TextInput
            style={styles.input}
            value={editedBio}
            onChangeText={setEditedBio}
            placeholder="Bio"
          />
          <TextInput
            style={styles.input}
            value={editedMatches.toString()}
            onChangeText={(text) => setEditedMatches(parseInt(text))}
            placeholder="Matches"
            keyboardType="numeric"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleSave} style={styles.button}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  slider: {
    width: '100%',
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

export default PlayerEditModal;
