import React, { createContext, useState, useContext, ReactNode } from 'react';

interface NamesContextType {
  names: string[];
  addName: (name: string) => void;
  setNames: (names: string[]) => void;
}

const NamesContext = createContext<NamesContextType | undefined>(undefined);

export const NamesProvider = ({ children }: { children: ReactNode }) => {
  const [names, setNames] = useState<string[]>(['Alice', 'Bob', 'Charlie', 'David', 'Eve']);

  const addName = (name: string) => {
    setNames((prevNames) => [...prevNames, name]);
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
