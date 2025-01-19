import React from 'react';
import { StyleSheet, View, Modal, TextInput, Button } from 'react-native';
import { Text } from './Themed';
import { Slider } from 'react-native-elements';
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
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
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
        <Button title="Save" onPress={handleSave} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  slider: {
    width: '80%',
    marginVertical: 10,
  },
});

export default PlayerEditModal;
