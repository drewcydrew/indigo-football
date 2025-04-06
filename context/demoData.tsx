export interface Player {
  name: string;
  score: number;
  included: boolean;
  bio: string;
  matches: number;
}

export interface Repulsor {
  player1: string;
  player2: string;
}

interface StorageData {
  names: Player[][];
  showScores: boolean;
  numTeams: number;
  teamNames?: Record<number, string>;
  teamColors?: Record<number, string>;
  repulsors?: Repulsor[];
  algorithm?: string; // Add algorithm to storage data
}

// Define demo data to use when no saved data exists
export const DEMO_DATA: StorageData = {
  names: [
    [
      {
        name: "Alex",
        score: 85,
        included: true,
        bio: "Fast striker",
        matches: 12,
      },
      {
        name: "Jordan",
        score: 72,
        included: true,
        bio: "Solid defender",
        matches: 10,
      },
      {
        name: "Taylor",
        score: 78,
        included: true,
        bio: "Midfield engine",
        matches: 15,
      },
    ],
    [
      {
        name: "Morgan",
        score: 83,
        included: true,
        bio: "Great goalkeeper",
        matches: 14,
      },
      {
        name: "Casey",
        score: 75,
        included: true,
        bio: "Wing specialist",
        matches: 11,
      },
      {
        name: "Riley",
        score: 80,
        included: true,
        bio: "Versatile player",
        matches: 13,
      },
    ],
  ],
  showScores: true,
  numTeams: 2,
  teamNames: {
    0: "Blue Dragons",
    1: "Red Phoenix",
  },
  teamColors: {
    0: "#1E88E5",
    1: "#D32F2F",
  },
  repulsors: [{ player1: "Alex", player2: "Casey" }],
  algorithm: "scores",
};
