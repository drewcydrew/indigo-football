import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Player {
  name: string;
  score: number;
}

interface NamesContextType {
  names: Player[][];
  addName: (name: string, score: number) => void;
  setNames: (names: Player[][]) => void;
}

const NamesContext = createContext<NamesContextType | undefined>(undefined);

export const NamesProvider = ({ children }: { children: ReactNode }) => {
  const [names, setNames] = useState<Player[][]>([
    [{ name: 'Alice', score: 0 }, { name: 'Bob', score: 0 }],
    [{ name: 'Charlie', score: 0 }, { name: 'David', score: 0 }, { name: 'Eve', score: 0 }],
  ]);

  const addName = (name: string, score: number) => {
    setNames((prevNames) => [
      ...prevNames,
      [{ name, score }],
    ]);
  };

  return (
    <NamesContext.Provider value={{ names, addName, setNames }}>
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
