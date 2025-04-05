import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ListRenderItem,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNames, Team, Player } from "../../context/NamesContext";
import { useThemeColor } from "../Themed";
import ColorPicker from "react-native-wheel-color-picker";
import Modal from "react-native-modal";

const TeamSplitter = ({ showScores }: { showScores: boolean }) => {
  const { teams, updateTeamName, updateTeamColor } = useNames();
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");

  const openColorPicker = (teamId: number, currentColor: string) => {
    setSelectedTeamId(teamId);
    setSelectedColor(currentColor || "#FFFFFF");
    setColorPickerVisible(true);
  };

  const saveTeamColor = () => {
    if (selectedTeamId !== null) {
      updateTeamColor(selectedTeamId, selectedColor);
    }
    setColorPickerVisible(false);
  };

  const renderTeam: ListRenderItem<Team> = ({ item: team }) => {
    const totalScore = team.players.reduce(
      (acc: number, player: Player) => acc + player.score,
      0
    );

    const teamColor = team.color || "#FFFFFF";

    return (
      <View
        style={[
          styles.teamContainer,
          { backgroundColor },
          { borderColor: teamColor, borderWidth: 3 },
        ]}
      >
        <View style={styles.teamHeader}>
          <TextInput
            style={[styles.teamTitleInput, { color: textColor }]}
            value={team.name || `Team ${team.id + 1}`}
            onChangeText={(newName) => updateTeamName(team.id, newName)}
            placeholder={`Team ${team.id + 1}`}
          />
          <TouchableOpacity
            onPress={() => openColorPicker(team.id, team.color || "#FFFFFF")}
            style={[styles.colorButton, { backgroundColor: teamColor }]}
          >
            <Text style={styles.colorButtonText}>Jersey</Text>
          </TouchableOpacity>
        </View>

        {showScores && (
          <Text style={[styles.totalScoreText, { color: textColor }]}>
            Total Score: {totalScore}
          </Text>
        )}

        {team.players.map((player: Player, playerIndex: number) => (
          <View key={playerIndex} style={styles.playerRow}>
            <Text style={[styles.nameText, { color: textColor }]}>
              {player.name}
            </Text>
            {showScores && (
              <Text style={[styles.scoreText, { color: textColor }]}>
                ({player.score})
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderRow = ({ item, index }: { item: Team[]; index: number }) => (
    <View style={styles.row}>
      {item.map((team, teamIndex) => (
        <View key={teamIndex} style={styles.column}>
          {renderTeam({
            item: team,
            index: teamIndex,
            separators: {
              highlight: () => {},
              unhighlight: () => {},
              updateProps: () => {},
            },
          })}
        </View>
      ))}
    </View>
  );

  const groupedTeams = teams.reduce((result: Team[][], team, index) => {
    const rowIndex = Math.floor(index / 2);
    if (!result[rowIndex]) {
      result[rowIndex] = [];
    }
    result[rowIndex].push(team);
    return result;
  }, []);

  return (
    <>
      <FlatList
        data={groupedTeams}
        renderItem={renderRow}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
      />

      <Modal
        isVisible={colorPickerVisible}
        onBackdropPress={() => setColorPickerVisible(false)}
        backdropOpacity={0.7}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Team Color</Text>
          <View style={styles.colorPickerContainer}>
            <ColorPicker
              color={selectedColor}
              onColorChange={setSelectedColor}
              thumbSize={30}
              sliderSize={30}
              noSnap={true}
              row={false}
            />
          </View>
          <View style={styles.colorPreview}>
            <Text>Selected Color:</Text>
            <View
              style={[styles.colorSample, { backgroundColor: selectedColor }]}
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={saveTeamColor}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexGrow: 1,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%",
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  teamContainer: {
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  teamHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  nameText: {
    fontSize: 14,
    marginVertical: 3,
  },
  nameInput: {
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingVertical: 2,
    flex: 1,
    marginRight: 5,
  },
  totalScoreText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 3,
  },
  scoreText: {
    fontSize: 14,
    marginLeft: 5,
  },
  colorButton: {
    padding: 5,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  colorButtonText: {
    fontSize: 12,
    color: "#000000",
    fontWeight: "bold",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  colorPickerContainer: {
    height: 300,
    width: "100%",
  },
  colorPreview: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  colorSample: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#000000",
  },
  saveButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  teamTitleInput: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginRight: 10,
  },
});

export default TeamSplitter;
