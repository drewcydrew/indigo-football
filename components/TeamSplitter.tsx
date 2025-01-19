import React from 'react';
import { StyleSheet, View, Text, FlatList, ListRenderItem } from 'react-native';
import { useNames, Team, Player } from '../context/NamesContext';
import { useThemeColor } from './Themed';

const TeamSplitter = ({ showScores }: { showScores: boolean }) => {
  const { teams } = useNames();
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  const renderTeam: ListRenderItem<Team> = ({ item: team }) => {
    const totalScore = team.players.reduce((acc: number, player: Player) => acc + player.score, 0);
    return (
      <View style={[styles.teamContainer, { backgroundColor }]}>
        <Text style={[styles.teamTitle, { color: textColor }]}>Team {team.id + 1}</Text>
        {showScores && (
          <Text style={[styles.totalScoreText, { color: textColor }]}>Total Score: {totalScore}</Text>
        )}
        {team.players.map((player: Player, playerIndex: number) => (
          <Text key={playerIndex} style={[styles.nameText, { color: textColor }]}>
            {player.name} {showScores && `(Score: ${player.score})`}
          </Text>
        ))}
      </View>
    );
  };

  const renderRow = ({ item, index }: { item: Team[], index: number }) => (
    <View style={styles.row}>
      {item.map((team, teamIndex) => (
        <View key={teamIndex} style={styles.column}>
          {renderTeam({ item: team, index: teamIndex, separators: { highlight: () => {}, unhighlight: () => {}, updateProps: () => {} } })}
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
    <FlatList
      data={groupedTeams}
      renderItem={renderRow}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexGrow: 1,
    width: '100%', // Ensure full width
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%', // Ensure full width
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  teamContainer: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  nameText: {
    fontSize: 14,
    marginVertical: 3,
  },
  totalScoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default TeamSplitter;
