import * as React from 'react';
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { saveToStorage, loadFromStorage } from '../utils/crossPlatformStorage';

export interface Player {
  name: string;
  score: number;
  included: boolean;
  bio: string; // New field for bio
  matches: number; // New field for number of matches
}

export interface Team {
  id: number;
  players: Player[];
}

interface NamesContextType {
  names: Player[][];
  teams: Team[];
  addName: (name: string, score: number) => void;
  setNames: (names: Player[][]) => void;
  togglePlayerIncluded: (name: string) => void;
  saveTeams: (newTeams: Player[][]) => void;
  updatePlayer: (name: string, newName: string, newScore: number, newBio: string, newMatches: number) => void;
  setAllIncluded: (included: boolean) => void;
  showScores: boolean; // Add showScores
  setShowScores: (value: boolean) => void; // Add setShowScores
  numTeams: number; // Add numTeams
  setNumTeams: (value: number) => void; // Add setNumTeams
}

const NamesContext = createContext<NamesContextType | undefined>(undefined);

const initialNames: Player[][] = [
  [
    { name: 'Bernie', score: 3, included: true, bio: 'A seasoned forward with a knack for scoring.', matches: 10 },
    { name: 'Sandy', score: 3, included: true, bio: 'A reliable defender known for strong tackles.', matches: 12 },
    { name: 'Jon', score: 3, included: true, bio: 'A versatile midfielder with great vision.', matches: 8 },
    { name: 'John', score: 3, included: true, bio: 'A goalkeeper with quick reflexes.', matches: 15 },
    { name: 'Sal', score: 3, included: true, bio: 'A forward with a powerful shot.', matches: 5 },
  ],
  [
    { name: 'Harry', score: 3, included: true, bio: 'A defender who excels in aerial duels.', matches: 10 },
    { name: 'Peter', score: 3, included: true, bio: 'A midfielder with excellent passing skills.', matches: 12 },
    { name: 'Denis', score: 3, included: true, bio: 'A forward known for his speed.', matches: 8 },
    { name: 'John N', score: 3, included: true, bio: 'A goalkeeper with great command of the box.', matches: 15 },
    { name: 'Michel', score: 3, included: true, bio: 'A defender with a strong presence.', matches: 5 },
  ],
  [
    { name: 'Mike', score: 3, included: true, bio: 'A forward with a keen eye for goal.', matches: 10 },
    { name: 'Michael', score: 3, included: true, bio: 'A midfielder who controls the tempo of the game.', matches: 12 },
    { name: 'John H', score: 3, included: true, bio: 'A versatile player who can play multiple positions.', matches: 8 },
    { name: 'Frank', score: 3, included: true, bio: 'A goalkeeper known for his shot-stopping ability.', matches: 15 },
    { name: 'Emilio', score: 3, included: true, bio: 'A forward with excellent dribbling skills.', matches: 5 },
  ],
  [
    { name: 'Enrique', score: 3, included: true, bio: 'A midfielder with great stamina.', matches: 10 },
    { name: 'Terry', score: 3, included: true, bio: 'A defender who reads the game well.', matches: 12 },
  ],
];

export const NamesProvider = ({ children }: { children: ReactNode }) => {
  const [names, setNames] = useState<Player[][]>(initialNames);
  const [teams, setTeams] = useState<Team[]>([]);
  const [showScores, setShowScores] = useState(true);
  const [numTeams, setNumTeams] = useState(2);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await loadFromStorage();
        if (savedData.names) {
          setNames(savedData.names);
        }
        setShowScores(savedData.showScores);
        setNumTeams(savedData.numTeams);
      } catch (error) {
        console.warn('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Save data when state changes
  useEffect(() => {
    if (isLoading) return;

    saveToStorage({
      names,
      showScores,
      numTeams
    });
  }, [names, showScores, numTeams, isLoading]);

  const addName = (name: string, score: number) => {
    setNames((prevNames) => {
      const teamScores = prevNames.map(team => team.reduce((acc, player) => acc + player.score, 0));
      const minScoreIndex = teamScores.indexOf(Math.min(...teamScores));
      const newNames = [...prevNames];
      newNames[minScoreIndex] = [...newNames[minScoreIndex], { name, score, included: true, bio: '', matches: 0 }];
      return newNames;
    });
  };

  const togglePlayerIncluded = (name: string) => {
    setNames((prevNames) =>
      prevNames.map((team) =>
        team.map((player) =>
          player.name === name ? { ...player, included: !player.included } : player
        )
      )
    );
  };

  const saveTeams = (newTeams: Player[][]) => {
    const newTeamArray = newTeams.map((team, index) => ({
      id: index,
      players: team,
    }));
    setTeams(newTeamArray);
  };

  const updatePlayer = (name: string, newName: string, newScore: number, newBio: string, newMatches: number) => {
    setNames((prevNames) =>
      prevNames.map((team) =>
        team.map((player) =>
          player.name === name ? { ...player, name: newName, score: newScore, bio: newBio, matches: newMatches } : player
        )
      )
    );
  };

  const setAllIncluded = (included: boolean) => {
    setNames((prevNames) =>
      prevNames.map((team) =>
        team.map((player) => ({ ...player, included }))
      )
    );
  };

  if (isLoading) {
    return null;
  }

  return (
    <NamesContext.Provider 
      value={{ 
        names, 
        teams, 
        addName, 
        setNames, 
        togglePlayerIncluded, 
        saveTeams, 
        updatePlayer, 
        setAllIncluded, 
        showScores, 
        setShowScores, 
        numTeams, 
        setNumTeams
      }}
    >
      {children}
    </NamesContext.Provider>
  );
};

export const useNames = () => {
  const context = useContext(NamesContext);
  if (!context) {
    throw new Error('useNames must be used within a NamesProvider');
  }
  return context;
};
