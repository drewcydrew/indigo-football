import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNames, Player, Repulsor } from "../../context/NamesContext";

// Import or define the helper functions
export function getRandomTeams(
  allPlayers: Player[],
  numTeams: number,
  repulsors: Repulsor[] = []
): Player[][] {
  const MAX_ATTEMPTS = 50;

  const shuffle = (array: Player[]): Player[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  if (allPlayers.length === 0) return [];

  // Helper function to check if teams respect repulsors
  const hasRepulsorViolations = (teams: Player[][]): boolean => {
    for (const repulsor of repulsors) {
      for (const team of teams) {
        const player1InTeam = team.some((p) => p.name === repulsor.player1);
        const player2InTeam = team.some((p) => p.name === repulsor.player2);
        if (player1InTeam && player2InTeam) {
          return true; // Violation found
        }
      }
    }
    return false; // No violations
  };

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const shuffledPlayers = shuffle(allPlayers);
    const minPlayersPerTeam = Math.floor(allPlayers.length / numTeams);
    const extraPlayers = allPlayers.length % numTeams;

    const teams: Player[][] = Array(numTeams)
      .fill([])
      .map(() => []);
    let currentIndex = 0;

    // First, distribute minimum players to each team
    for (let i = 0; i < numTeams; i++) {
      teams[i] = shuffledPlayers.slice(
        currentIndex,
        currentIndex + minPlayersPerTeam
      );
      currentIndex += minPlayersPerTeam;
    }

    // Then distribute extra players one by one
    for (let i = 0; i < extraPlayers; i++) {
      teams[i].push(shuffledPlayers[currentIndex + i]);
    }

    // Check if this distribution respects repulsors
    if (!hasRepulsorViolations(teams)) {
      return teams; // Valid distribution found
    }
  }

  // If we couldn't find a valid distribution, try our best with swapping
  console.warn(
    "Could not find a perfect team distribution after maximum attempts. Using best effort approach."
  );

  // Fallback to normal distribution
  const shuffledPlayers = shuffle(allPlayers);
  const minPlayersPerTeam = Math.floor(allPlayers.length / numTeams);
  const extraPlayers = allPlayers.length % numTeams;

  const teams: Player[][] = Array(numTeams)
    .fill([])
    .map(() => []);
  let currentIndex = 0;

  for (let i = 0; i < numTeams; i++) {
    teams[i] = shuffledPlayers.slice(
      currentIndex,
      currentIndex + minPlayersPerTeam
    );
    currentIndex += minPlayersPerTeam;
  }

  for (let i = 0; i < extraPlayers; i++) {
    teams[i].push(shuffledPlayers[currentIndex + i]);
  }

  return teams;
}

export function getRandomTeamsByScores(
  players: Player[],
  numTeams: number,
  repulsors: Repulsor[] = []
): Player[][] {
  const MAX_ATTEMPTS = 50;

  if (players.length === 0) return [];

  // Helper function to check if teams respect repulsors
  const hasRepulsorViolations = (teams: Player[][]): boolean => {
    for (const repulsor of repulsors) {
      for (const team of teams) {
        const player1InTeam = team.some((p) => p.name === repulsor.player1);
        const player2InTeam = team.some((p) => p.name === repulsor.player2);
        if (player1InTeam && player2InTeam) {
          return true; // Violation found
        }
      }
    }
    return false; // No violations
  };

  // Try multiple distributions to find one that respects repulsors
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    // Group players by score
    const scoreGroups: { [key: number]: Player[] } = {};
    players.forEach((player) => {
      if (!scoreGroups[player.score]) {
        scoreGroups[player.score] = [];
      }
      scoreGroups[player.score].push(player);
    });

    // Shuffle each score group
    Object.values(scoreGroups).forEach((group) => {
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
    sortedPlayers.forEach((player) => {
      const minScoreIndex = teamScores.indexOf(Math.min(...teamScores));
      teams[minScoreIndex].push(player);
      teamScores[minScoreIndex] += player.score;
    });

    // Check if this distribution respects repulsors
    if (!hasRepulsorViolations(teams)) {
      return teams; // Valid distribution found
    }
  }

  console.warn(
    "Could not find a perfect team distribution after maximum attempts. Using best effort approach."
  );

  // Fallback to a standard distribution
  const scoreGroups: { [key: number]: Player[] } = {};
  players.forEach((player) => {
    if (!scoreGroups[player.score]) {
      scoreGroups[player.score] = [];
    }
    scoreGroups[player.score].push(player);
  });

  Object.values(scoreGroups).forEach((group) => {
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

  sortedPlayers.forEach((player) => {
    const minScoreIndex = teamScores.indexOf(Math.min(...teamScores));
    teams[minScoreIndex].push(player);
    teamScores[minScoreIndex] += player.score;
  });

  return teams;
}

const RandomizeTeamsRandomizeIcon: React.FC = () => {
  // Get everything we need directly from context
  const { names, saveTeams, numTeams, repulsors, algorithm } = useNames();

  const handleRandomize = () => {
    const allPlayers = [...names.flat()].filter((player) => player.included);
    if (allPlayers.length === 0) {
      console.warn("No players available to create teams");
      return;
    }

    let teams: Player[][] = [];
    if (algorithm === "scores") {
      teams = getRandomTeamsByScores(allPlayers, numTeams, repulsors);
    } else {
      teams = getRandomTeams(allPlayers, numTeams, repulsors);
    }

    saveTeams(teams);
  };

  return (
    <TouchableOpacity style={styles.iconButton} onPress={handleRandomize}>
      <Icon name="shuffle" size={40} color="#007bff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    marginHorizontal: 10,
  },
});

export default RandomizeTeamsRandomizeIcon;
