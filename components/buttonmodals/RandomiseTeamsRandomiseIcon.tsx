import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
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

export function getRandomTeamsByAverage(
  players: Player[],
  numTeams: number,
  repulsors: Repulsor[] = []
): Player[][] {
  if (players.length === 0 || numTeams <= 0) {
    return [];
  }

  const MAX_ATTEMPTS = 2000; // Significantly increased attempts for better results
  let bestTeams: Player[][] = [];
  let bestScore = Infinity;

  // Helper function to shuffle array
  const shuffle = (array: Player[]): Player[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Helper function to check if teams respect repulsors
  const hasRepulsorViolations = (teams: Player[][]): boolean => {
    for (const repulsor of repulsors) {
      for (const team of teams) {
        const player1InTeam = team.some((p) => p.name === repulsor.player1);
        const player2InTeam = team.some((p) => p.name === repulsor.player2);
        if (player1InTeam && player2InTeam) {
          return true;
        }
      }
    }
    return false;
  };

  // Helper function to calculate team average
  const getTeamAverage = (team: Player[]): number => {
    if (team.length === 0) return 0;
    const total = team.reduce((sum, player) => sum + player.score, 0);
    return total / team.length;
  };

  // Enhanced balance scoring function
  const calculateBalanceScore = (teams: Player[][]): number => {
    const averages = teams
      .map((team) => getTeamAverage(team))
      .filter((avg) => avg > 0);
    if (averages.length <= 1) return 0;

    // Calculate variance (lower is better)
    const mean = averages.reduce((sum, avg) => sum + avg, 0) / averages.length;
    const variance =
      averages.reduce((sum, avg) => sum + Math.pow(avg - mean, 2), 0) /
      averages.length;

    // Calculate range (difference between highest and lowest average)
    const maxAvg = Math.max(...averages);
    const minAvg = Math.min(...averages);
    const range = maxAvg - minAvg;

    // Calculate standard deviation
    const stdDev = Math.sqrt(variance);

    // Combined score: heavily weight both variance and range
    // Lower scores are better
    const balanceScore = variance * 100 + range * 50 + stdDev * 25;

    return balanceScore;
  };

  // Try multiple random distributions and pick the best one
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const shuffledPlayers = shuffle(players);
    const teams: Player[][] = Array(numTeams)
      .fill(null)
      .map(() => []);

    // Distribute players evenly across teams
    const minPlayersPerTeam = Math.floor(players.length / numTeams);
    const extraPlayers = players.length % numTeams;
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
    if (hasRepulsorViolations(teams)) {
      continue;
    }

    // Calculate balance score
    const balanceScore = calculateBalanceScore(teams);

    // Calculate averages for logging
    const averages = teams
      .map((team) => getTeamAverage(team))
      .filter((avg) => avg > 0);
    const maxAvg = Math.max(...averages);
    const minAvg = Math.min(...averages);
    const range = maxAvg - minAvg;

    // Keep track of the best distribution so far
    if (balanceScore < bestScore) {
      bestScore = balanceScore;
      bestTeams = teams.map((team) => [...team]); // Deep copy

      // If we achieve excellent balance, we can stop early
      // Very strict criteria: range < 0.2 and balance score < 3
      if (range < 0.2 && balanceScore < 3) {
        break;
      }

      // Good balance criteria: range < 0.3 and balance score < 5
      if (range < 0.3 && balanceScore < 5 && attempt > 200) {
        break;
      }

      // Decent balance criteria: range < 0.5 and balance score < 10
      if (range < 0.5 && balanceScore < 10 && attempt > 500) {
        break;
      }
    }
  }

  // If we didn't find any valid distribution due to repulsors, fall back to a simple distribution
  if (bestTeams.length === 0) {
    const shuffledPlayers = shuffle(players);
    const teams: Player[][] = Array(numTeams)
      .fill(null)
      .map(() => []);

    const minPlayersPerTeam = Math.floor(players.length / numTeams);
    const extraPlayers = players.length % numTeams;
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

    bestTeams = teams;
  }

  return bestTeams;
}

const RandomizeTeamsRandomizeIcon: React.FC = () => {
  // Get everything we need directly from context
  const { names, saveTeams, numTeams, repulsors, algorithm } = useNames();

  const handleRandomize = () => {
    const allPlayers = [...names.flat()].filter((player) => player.included);
    if (allPlayers.length === 0) {
      return;
    }

    let teams: Player[][] = [];
    if (algorithm === "total") {
      teams = getRandomTeamsByScores(allPlayers, numTeams, repulsors);
    } else if (algorithm === "average") {
      teams = getRandomTeamsByAverage(allPlayers, numTeams, repulsors);
    } else {
      teams = getRandomTeams(allPlayers, numTeams, repulsors);
    }

    saveTeams(teams);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={handleRandomize}>
        <Icon name="shuffle" size={40} color="#007bff" />
      </TouchableOpacity>
      <Text style={styles.algorithmText}>
        {algorithm === "total"
          ? "total"
          : algorithm === "average"
          ? "average"
          : "random"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  iconButton: {
    // marginHorizontal removed since it's now on container
  },
  algorithmText: {
    fontSize: 10,
    color: "#007bff",
    marginTop: 2,
    fontWeight: "500",
  },
});

export default RandomizeTeamsRandomizeIcon;
