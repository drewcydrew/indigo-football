import React, { createContext, useState, useContext, ReactNode } from 'react';

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
}

const NamesContext = createContext<NamesContextType | undefined>(undefined);

export const NamesProvider = ({ children }: { children: ReactNode }) => {
  const [names, setNames] = useState<Player[][]>([
    [
      { name: 'Alice', score: 3, included: true, bio: 'Forward', matches: 10 },
      { name: 'Bob', score: 4, included: true, bio: 'Defender', matches: 12 },
      { name: 'Charlie', score: 2, included: true, bio: 'Midfielder', matches: 8 },
      { name: 'David', score: 5, included: true, bio: 'Goalkeeper', matches: 15 },
      { name: 'Eve', score: 1, included: true, bio: 'Forward', matches: 5 },
    ],
    [
      { name: 'Frank', score: 3, included: true, bio: 'Defender', matches: 10 },
      { name: 'Grace', score: 4, included: true, bio: 'Midfielder', matches: 12 },
      { name: 'Heidi', score: 2, included: true, bio: 'Forward', matches: 8 },
      { name: 'Ivan', score: 5, included: true, bio: 'Goalkeeper', matches: 15 },
      { name: 'Judy', score: 1, included: true, bio: 'Defender', matches: 5 },
    ],
    [
      { name: 'Mallory', score: 3, included: true, bio: 'Forward', matches: 10 },
      { name: 'Niaj', score: 4, included: true, bio: 'Defender', matches: 12 },
      { name: 'Olivia', score: 2, included: true, bio: 'Midfielder', matches: 8 },
      { name: 'Peggy', score: 5, included: true, bio: 'Goalkeeper', matches: 15 },
      { name: 'Sybil', score: 1, included: true, bio: 'Forward', matches: 5 },
    ],
    [
      { name: 'Trent', score: 3, included: true, bio: 'Defender', matches: 10 },
      { name: 'Victor', score: 4, included: true, bio: 'Midfielder', matches: 12 },
      { name: 'Walter', score: 2, included: true, bio: 'Forward', matches: 8 },
      { name: 'Xander', score: 5, included: true, bio: 'Goalkeeper', matches: 15 },
      { name: 'Yvonne', score: 1, included: true, bio: 'Defender', matches: 5 },
    ],
  ]);

  const [teams, setTeams] = useState<Team[]>([]);

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

  return (
    <NamesContext.Provider value={{ names, teams, addName, setNames, togglePlayerIncluded, saveTeams, updatePlayer, setAllIncluded }}>
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
