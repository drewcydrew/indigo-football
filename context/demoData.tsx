import { StorageData } from "./NamesContext";

// Define demo data to use when no saved data exists
export const DEMO_DATA: StorageData = {
  names: [
    // Defenders
    [
    ],
  ],
  showScores: true,
  numTeams: 4,
  teamNames: {
    0: "Team 1",
    1: "Team 2",
    2: "Team 3",
    3: "Team 4",
  },
  teamColors: {
    0: "#00A550", // Green
    1: "#FF3131", // Red
    2: "#FFCC00", // Yellow
    3: "#FF8C00", // Orange
  },
  repulsors: [
  ],
  algorithm: "scores",
};
