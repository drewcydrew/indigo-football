import { useNames } from "./NamesContext";
import { getRandomTeams, getRandomTeamsByScores } from "../components/buttonmodals/RandomiseTeamsRandomiseIcon";

export function useTeamGeneration() {
  const { names, saveTeams, numTeams: contextNumTeams, repulsors, algorithm: contextAlgorithm } = useNames();
  
  const generateTeams = (
    overrideNumTeams?: number,
    overrideAlgorithm?: string
  ) => {
    // Use override values if provided, otherwise use context values
    const numTeams = overrideNumTeams !== undefined ? overrideNumTeams : contextNumTeams;
    const algorithm = overrideAlgorithm || contextAlgorithm;
    
    console.log(`Generating ${numTeams} teams using ${algorithm} algorithm`);
    
    const allPlayers = [...names.flat()].filter((player) => player.included);
    if (allPlayers.length === 0) {
      console.warn("No players available to create teams");
      return false;
    }

    let teams = [];
    if (algorithm === "scores") {
      teams = getRandomTeamsByScores(allPlayers, numTeams, repulsors);
    } else {
      teams = getRandomTeams(allPlayers, numTeams, repulsors);
    }

    saveTeams(teams);
    return true;
  };
  
  return { generateTeams };
}