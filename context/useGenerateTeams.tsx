import { useNames } from "./NamesContext";
import {
  getRandomTeams,
  getRandomTeamsByScores,
  getRandomTeamsByAverage,
} from "../components/buttonmodals/RandomiseTeamsRandomiseIcon";

export function useTeamGeneration() {
  const {
    names,
    saveTeams,
    numTeams: contextNumTeams,
    repulsors,
    algorithm: contextAlgorithm,
  } = useNames();

  const generateTeams = (
    overrideNumTeams?: number,
    overrideAlgorithm?: string
  ) => {
    // Use override values if provided, otherwise use context values
    const numTeams =
      overrideNumTeams !== undefined ? overrideNumTeams : contextNumTeams;
    const algorithm = overrideAlgorithm || contextAlgorithm;

    console.log("=== generateTeams START ===");
    console.log(`Generating ${numTeams} teams using ${algorithm} algorithm`);

    const allPlayers = [...names.flat()].filter((player) => player.included);
    console.log(
      "Available players for team generation:",
      allPlayers.length,
      allPlayers.map((p) => `${p.name}(${p.score})`)
    );
    if (allPlayers.length === 0) {
      console.warn("No players available to create teams");
      return false;
    }

    let teams = [];
    if (algorithm === "scores") {
      console.log("Using scores algorithm");
      teams = getRandomTeamsByScores(allPlayers, numTeams, repulsors);
    } else if (algorithm === "average") {
      console.log("Using average algorithm");
      teams = getRandomTeamsByAverage(allPlayers, numTeams, repulsors);
    } else {
      console.log("Using players algorithm");
      teams = getRandomTeams(allPlayers, numTeams, repulsors);
    }

    console.log(
      "Generated teams result from algorithm:",
      teams.length,
      "teams"
    );
    teams.forEach((team, index) => {
      console.log(
        `Generated Team ${index}:`,
        team.length,
        "players -",
        team.map((p) => p.name)
      );
    });

    // Verify the teams array structure before passing to saveTeams
    console.log("Teams array structure check:");
    for (let i = 0; i < teams.length; i++) {
      console.log(`teams[${i}] is array:`, Array.isArray(teams[i]));
      console.log(`teams[${i}] length:`, teams[i].length);
    }

    console.log("About to call saveTeams with teams:", teams);
    saveTeams(teams);
    console.log("=== generateTeams END ===");
    return true;
  };

  return { generateTeams };
}
