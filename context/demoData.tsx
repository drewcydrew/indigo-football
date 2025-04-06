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
    // Defenders
    [
      {
        name: "Guglielmo Vicario",
        score: 5,
        included: true,
        bio: "Commanding goalkeeper with quick reflexes and confident distribution.",
        matches: 26,
      },
      {
        name: "Pedro Porro",
        score: 4,
        included: true,
        bio: "Attack-minded right-back with flair, speed, and crossing ability.",
        matches: 24,
      },
      {
        name: "Cristian Romero",
        score: 5,
        included: true,
        bio: "Aggressive centre-back with excellent tackling and anticipation.",
        matches: 25,
      },
      {
        name: "Micky van de Ven",
        score: 4,
        included: true,
        bio: "Fast, composed centre-back known for his recovery pace.",
        matches: 22,
      },
      {
        name: "Destiny Udogie",
        score: 4,
        included: true,
        bio: "Energetic left-back with strong attacking instincts and agility.",
        matches: 23,
      },
      {
        name: "Ben Davies",
        score: 3,
        included: true,
        bio: "Reliable veteran defender with strong positional sense.",
        matches: 17,
      },
      {
        name: "Emerson Royal",
        score: 3,
        included: true,
        bio: "Versatile full-back who contributes on both ends of the pitch.",
        matches: 18,
      },
      {
        name: "Ashley Phillips",
        score: 3,
        included: true,
        bio: "Young centre-back prospect with solid potential and composure.",
        matches: 8,
      },
      {
        name: "Radu Drăgușin",
        score: 3,
        included: true,
        bio: "Physically strong defender with good aerial ability and focus.",
        matches: 10,
      },
    ],
    // Midfielders
    [
      {
        name: "James Maddison",
        score: 5,
        included: true,
        bio: "Creative playmaker with great vision, dribbling, and set-piece skill.",
        matches: 22,
      },
      {
        name: "Rodrigo Bentancur",
        score: 4,
        included: true,
        bio: "Elegant midfielder with excellent control and defensive awareness.",
        matches: 20,
      },
      {
        name: "Pape Matar Sarr",
        score: 4,
        included: true,
        bio: "Energetic box-to-box midfielder with great engine and tactical sense.",
        matches: 23,
      },
      {
        name: "Yves Bissouma",
        score: 4,
        included: true,
        bio: "Strong defensive midfielder with top-tier ball-winning skills.",
        matches: 21,
      },
      {
        name: "Giovani Lo Celso",
        score: 3,
        included: true,
        bio: "Skilled midfielder with creativity and a strong left foot.",
        matches: 16,
      },
      {
        name: "Pierre-Emile Højbjerg",
        score: 3,
        included: true,
        bio: "Hard-working midfielder known for his leadership and grit.",
        matches: 18,
      },
      {
        name: "Oliver Skipp",
        score: 3,
        included: true,
        bio: "Disciplined midfielder who maintains shape and recycles possession.",
        matches: 14,
      },
      {
        name: "Alfie Devine",
        score: 3,
        included: true,
        bio: "Young attacking midfielder with promise and technical flair.",
        matches: 7,
      },
      {
        name: "Jamie Donley",
        score: 3,
        included: true,
        bio: "Versatile young midfielder with intelligence and creativity.",
        matches: 6,
      },
    ],
    // Forwards
    [
      {
        name: "Son Heung-min",
        score: 5,
        included: true,
        bio: "World-class forward known for his pace, finishing, and leadership.",
        matches: 25,
      },
      {
        name: "Richarlison",
        score: 4,
        included: true,
        bio: "Tenacious striker with strength and goal-scoring instincts.",
        matches: 22,
      },
      {
        name: "Dejan Kulusevski",
        score: 4,
        included: true,
        bio: "Creative winger with strength, vision, and sharp passing.",
        matches: 23,
      },
      {
        name: "Timo Werner",
        score: 4,
        included: true,
        bio: "Quick, versatile attacker with smart movement and work rate.",
        matches: 19,
      },
      {
        name: "Brennan Johnson",
        score: 3,
        included: true,
        bio: "Young, fast forward who excels in counterattacking situations.",
        matches: 20,
      },
      {
        name: "Manor Solomon",
        score: 3,
        included: true,
        bio: "Winger with technical ability and quick feet in tight spaces.",
        matches: 12,
      },
      {
        name: "Alejo Véliz",
        score: 3,
        included: true,
        bio: "Promising young striker with physical presence and goal threat.",
        matches: 8,
      },
    ],
  ],
  showScores: true,
  numTeams: 3,
  teamNames: {
    0: "Spurs Defenders",
    1: "Spurs Midfielders",
    2: "Spurs Forwards",
  },
  teamColors: {
    0: "#132257",
    1: "#5A5A5A",
    2: "#FFFFFF",
  },
  repulsors: [
    { player1: "Cristian Romero", player2: "Timo Werner" },
    { player1: "Pierre-Emile Højbjerg", player2: "Giovani Lo Celso" },
  ],
  algorithm: "scores",
};
