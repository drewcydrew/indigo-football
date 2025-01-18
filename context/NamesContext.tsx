import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Player {
  name: string;
  score: number;
  included: boolean;
}

interface Team {
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
}

const NamesContext = createContext<NamesContextType | undefined>(undefined);

export const NamesProvider = ({ children }: { children: ReactNode }) => {
  const [names, setNames] = useState<Player[][]>([
    [
      { name: 'Alice', score: 3, included: true },
      { name: 'Bob', score: 4, included: true },
      { name: 'Charlie', score: 2, included: true },
      { name: 'David', score: 5, included: true },
      { name: 'Eve', score: 1, included: true },
    ],
    [
      { name: 'Frank', score: 3, included: true },
      { name: 'Grace', score: 4, included: true },
      { name: 'Heidi', score: 2, included: true },
      { name: 'Ivan', score: 5, included: true },
      { name: 'Judy', score: 1, included: true },
    ],
    [
      { name: 'Mallory', score: 3, included: true },
      { name: 'Niaj', score: 4, included: true },
      { name: 'Olivia', score: 2, included: true },
      { name: 'Peggy', score: 5, included: true },
      { name: 'Sybil', score: 1, included: true },
    ],
    [
      { name: 'Trent', score: 3, included: true },
      { name: 'Victor', score: 4, included: true },
      { name: 'Walter', score: 2, included: true },
      { name: 'Xander', score: 5, included: true },
      { name: 'Yvonne', score: 1, included: true },
    ],
  ]);

  const [teams, setTeams] = useState<Team[]>([]);

  const addName = (name: string, score: number) => {
    setNames((prevNames) => {
      const teamScores = prevNames.map(team => team.reduce((acc, player) => acc + player.score, 0));
      const minScoreIndex = teamScores.indexOf(Math.min(...teamScores));
      const newNames = [...prevNames];
      newNames[minScoreIndex] = [...newNames[minScoreIndex], { name, score, included: true }];
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

  return (
    <NamesContext.Provider value={{ names, teams, addName, setNames, togglePlayerIncluded, saveTeams }}>
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
