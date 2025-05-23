import * as React from "react";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { saveToStorage, loadFromStorage } from "../utils/crossPlatformStorage";
import { db } from "../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { sha256 } from "js-sha256";

import { DEMO_DATA } from "./demoData"; // Import demo data

export interface Player {
  name: string;
  score: number;
  included: boolean;
  bio: string;
  matches: number;
}

export interface StorageData {
  names: Player[][];
  showScores: boolean;
  numTeams: number;
  teamNames?: Record<number, string>;
  teamColors?: Record<number, string>;
  repulsors?: Repulsor[];
  algorithm?: string; // Add algorithm to storage data
}

interface FirestorePlayer extends Player {
  teamIndex: number;
  playerIndex: number;
}

export interface Team {
  id: number;
  players: Player[];
  name: string;
  color?: string; // Add color property
}

// Add this interface to your types
export interface Repulsor {
  player1: string;
  player2: string;
}

interface NamesContextType {
  names: Player[][];
  repulsors: Repulsor[];
  addRepulsor: (player1: string, player2: string) => void;
  removeRepulsor: (player1: string, player2: string) => void;
  teams: Team[];
  teamNames?: Record<number, string>; // New state for team names
  addName: (name: string, score: number) => void;
  setNames: (names: Player[][]) => void;
  togglePlayerIncluded: (name: string) => void;
  saveTeams: (newTeams: Player[][]) => void;
  updatePlayer: (
    name: string,
    newName: string,
    newScore: number,
    newBio: string,
    newMatches: number
  ) => void;
  updatePlayerName: (
    teamId: number,
    playerIndex: number,
    newName: string
  ) => void; // Add this function
  updateTeamName: (teamId: number, newName: string) => void;
  updateTeamColor: (teamId: number, color: string) => void; // Add this function
  setAllIncluded: (included: boolean) => void;
  showScores: boolean;
  setShowScores: (value: boolean) => void;
  numTeams: number;
  setNumTeams: (value: number) => void;
  deletePlayer: (player: Player) => void;
  saveToFirestore: (
    collectionName?: string,
    password?: string | null
  ) => Promise<void>;
  loadFromFirestore: (
    collectionName?: string,
    password?: string | null,
    checkPasswordOnly?: boolean
  ) => Promise<any>;
  algorithm: string; // Add algorithm state
  setAlgorithm: (value: string) => void; // Add algorithm setter
  currentCollection: string; // Add current collection state
  setCurrentCollection: (value: string) => void; // Add setter for current collection
}

const NamesContext = createContext<NamesContextType | undefined>(undefined);

export const NamesProvider = ({ children }: { children: ReactNode }) => {
  const [names, setNames] = useState<Player[][]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [showScores, setShowScores] = useState(true);
  const [numTeams, setNumTeams] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [teamColors, setTeamColors] = useState<Record<number, string>>({});
  const [teamNames, setTeamNames] = useState<Record<number, string>>({}); // New state for team names
  const [repulsors, setRepulsors] = useState<Repulsor[]>([]);
  const [algorithm, setAlgorithm] = useState("scores");

  const [currentCollection, setCurrentCollection] = useState<string>("teams");

  useEffect(() => {
    if (isLoading) return;

    const newTeamArray = names.map((teamPlayers, index) => ({
      id: index,
      name: teamNames[index] || `Team ${index + 1}`, // Use stored name or default
      players: teamPlayers,
      color: teamColors[index] || defaultColors[index % defaultColors.length], // Use default colors
    }));

    setTeams(newTeamArray);
  }, [names, teamColors, teamNames, isLoading]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = (await loadFromStorage()) as StorageData;

        // Improved check for existing data
        const hasData = Boolean(
          savedData &&
            savedData.names &&
            savedData.names.length > 0 &&
            savedData.names.some((team) => team.length > 0)
        );

        console.log("Has existing data:", hasData);
        const dataToUse = hasData ? savedData : DEMO_DATA;

        console.log("Using demo data:", !hasData);

        if (dataToUse.names) {
          setNames(dataToUse.names);
        }

        if (dataToUse.teamNames) {
          setTeamNames(dataToUse.teamNames);
        }

        if (dataToUse.teamColors) {
          setTeamColors(dataToUse.teamColors);
        }

        if (dataToUse.repulsors) {
          setRepulsors(dataToUse.repulsors);
        }

        if (dataToUse.algorithm) {
          setAlgorithm(dataToUse.algorithm);
        }

        setShowScores(dataToUse.showScores ?? true);
        setNumTeams(dataToUse.numTeams ?? 2);
      } catch (error) {
        console.warn("Error loading data:", error);
        // If there's an error loading data, use demo data
        setNames(DEMO_DATA.names);
        setTeamNames(DEMO_DATA.teamNames || {});
        setTeamColors(DEMO_DATA.teamColors || {});
        setRepulsors(DEMO_DATA.repulsors || []);
        setAlgorithm(DEMO_DATA.algorithm || "scores");
        setShowScores(DEMO_DATA.showScores);
        setNumTeams(DEMO_DATA.numTeams);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Save data when state changes
  useEffect(() => {
    if (isLoading) return;

    const dataToSave: StorageData = {
      names,
      showScores,
      numTeams,
      teamNames,
      teamColors,
      repulsors,
      algorithm,
    };

    saveToStorage(dataToSave);
  }, [
    names,
    showScores,
    numTeams,
    teamNames,
    teamColors,
    repulsors,
    isLoading,
    algorithm,
  ]);

  const addName = (name: string, score: number) => {
    setNames((prevNames) => {
      const teamScores = prevNames.map((team) =>
        team.reduce((acc, player) => acc + player.score, 0)
      );
      const minScoreIndex = teamScores.indexOf(Math.min(...teamScores));
      const newNames = [...prevNames];
      newNames[minScoreIndex] = [
        ...newNames[minScoreIndex],
        { name, score, included: true, bio: "", matches: 0 },
      ];
      return newNames;
    });
  };

  const addRepulsor = (player1: string, player2: string) => {
    // Sort player names alphabetically to ensure consistent storage
    const [sortedPlayer1, sortedPlayer2] = [player1, player2].sort();

    setRepulsors((prev) => {
      // Check if this repulsor already exists
      const exists = prev.some(
        (r) => r.player1 === sortedPlayer1 && r.player2 === sortedPlayer2
      );

      if (exists) return prev;

      return [...prev, { player1: sortedPlayer1, player2: sortedPlayer2 }];
    });
  };

  const removeRepulsor = (player1: string, player2: string) => {
    // Sort player names alphabetically to match storage format
    const [sortedPlayer1, sortedPlayer2] = [player1, player2].sort();

    setRepulsors((prev) =>
      prev.filter(
        (r) => !(r.player1 === sortedPlayer1 && r.player2 === sortedPlayer2)
      )
    );
  };

  const defaultColors = [
    "#1E88E5", // Blue
    "#D32F2F", // Red
    "#388E3C", // Green
    "#FBC02D", // Yellow
    "#F57C00", // Orange
    "#7B1FA2", // Purple
    "#00ACC1", // Teal
    "#5D4037", // Brown
    "#546E7A", // Blue Grey
    "#E64A19", // Deep Orange
  ];

  const togglePlayerIncluded = (name: string) => {
    setNames((prevNames) =>
      prevNames.map((team) =>
        team.map((player) =>
          player.name === name
            ? { ...player, included: !player.included }
            : player
        )
      )
    );
  };

  const saveTeams = (newTeams: Player[][]) => {
    // Get all currently excluded players
    const excludedPlayers = names.flat().filter((player) => !player.included);

    // Create a copy of the new teams
    const updatedTeams = [...newTeams];

    // If there are excluded players, add them to a "bench" team
    if (excludedPlayers.length > 0) {
      // Create an "excluded" team at the end of the array
      updatedTeams.push(excludedPlayers);
    }

    setNames(updatedTeams);

    // When new teams are created, preserve existing names and colors where possible
    // and create defaults for new teams
    const defaultColors = [
      "#1E88E5", // Blue
      "#D32F2F", // Red
      "#388E3C", // Green
      "#FBC02D", // Yellow
      "#F57C00", // Orange
      "#7B1FA2", // Purple
      "#00ACC1", // Teal
      "#5D4037", // Brown
      "#546E7A", // Blue Grey
      "#E64A19", // Deep Orange
    ];

    // Update teams with preserved names and colors
    const updatedTeamsArray = updatedTeams.map((players, index) => ({
      id: index,
      players: players,
      name: teamNames[index] || `Team ${index + 1}`,
      color: teamColors[index] || defaultColors[index % defaultColors.length],
    }));

    setTeams(updatedTeamsArray);
  };

  const updatePlayer = (
    name: string,
    newName: string,
    newScore: number,
    newBio: string,
    newMatches: number
  ) => {
    setNames((prevNames) =>
      prevNames.map((team) =>
        team.map((player) =>
          player.name === name
            ? {
                ...player,
                name: newName,
                score: newScore,
                bio: newBio,
                matches: newMatches,
              }
            : player
        )
      )
    );
  };

  const updateTeamName = (teamId: number, newName: string) => {
    setTeamNames((prevNames) => ({
      ...prevNames,
      [teamId]: newName,
    }));
  };

  const setAllIncluded = (included: boolean) => {
    setNames((prevNames) =>
      prevNames.map((team) => team.map((player) => ({ ...player, included })))
    );
  };

  const deletePlayer = (player: Player) => {
    setNames((prevNames) =>
      prevNames.map((team) => team.filter((p) => p.name !== player.name))
    );
  };

  const updatePlayerName = (
    teamId: number,
    playerIndex: number,
    newName: string
  ) => {
    setNames((prevNames) => {
      const updatedNames = [...prevNames];
      if (updatedNames[teamId] && updatedNames[teamId][playerIndex]) {
        const updatedTeam = [...updatedNames[teamId]];
        updatedTeam[playerIndex] = {
          ...updatedTeam[playerIndex],
          name: newName,
        };
        updatedNames[teamId] = updatedTeam;
      }
      return updatedNames;
    });
  };

  const updateTeamColor = (teamId: number, color: string) => {
    setTeamColors((prevColors) => ({
      ...prevColors,
      [teamId]: color,
    }));
  };

  const saveToFirestore = async (
    collectionName?: string,
    password?: string | null
  ) => {
    try {
      const collection = collectionName || currentCollection;

      const processedNames = names
        .map((team, teamIndex) => {
          return team.map(
            (player, playerIndex) =>
              ({
                ...player,
                teamIndex,
                playerIndex,
              } as FirestorePlayer)
          );
        })
        .flat();

      // Create the data object
      const dataToSave = {
        players: processedNames,
        teamNames,
        teamColors,
        showScores,
        numTeams,
        lastUpdated: new Date().toISOString(),
      };

      // Save metadata separately to know if collection is password protected
      await setDoc(doc(db, collection, "metadata"), {
        hasPassword: !!password,
        lastUpdated: new Date().toISOString(),
      });

      // If password protected, save the password hash and use encryption
      if (password) {
        // Hash the password with SHA-256
        const passwordHash = sha256(password);

        // Save with password hash
        await setDoc(doc(db, collection, "current"), {
          ...dataToSave,
          _passwordHash: passwordHash,
        });
      } else {
        // Save without password protection
        await setDoc(doc(db, collection, "current"), dataToSave);
      }
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      throw error;
    }
  };

  const loadFromFirestore = async (
    collectionName?: string,
    password?: string | null,
    checkPasswordOnly: boolean = false
  ) => {
    try {
      const collection = collectionName || currentCollection;

      // First check if this collection exists and if it's password protected
      const docRef = doc(db, collection, "current");
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error(`No data found in collection: ${collection}`);
      }

      const data = docSnap.data();
      const isPasswordProtected = !!data._passwordHash;

      // If we're just checking if password protection exists
      if (checkPasswordOnly) {
        return { isPasswordProtected };
      }

      // Check if password is required but not provided
      if (isPasswordProtected && !password) {
        throw new Error("Password required");
      }

      // Verify password if collection is protected
      if (isPasswordProtected && password) {
        const passwordHash = sha256(password);
        if (passwordHash !== data._passwordHash) {
          throw new Error("Incorrect password");
        }
      }

      // Password is correct or not needed, reconstruct data
      const reconstructedNames: Player[][] = Array(numTeams)
        .fill([])
        .map(() => []);

      (data.players as FirestorePlayer[]).forEach((player) => {
        if (!reconstructedNames[player.teamIndex]) {
          reconstructedNames[player.teamIndex] = [];
        }
        const { teamIndex, playerIndex, ...cleanPlayer } = player;
        reconstructedNames[player.teamIndex].push(cleanPlayer);
      });

      setNames(reconstructedNames);

      // Load team names and colors if available
      if (data.teamNames) {
        setTeamNames(data.teamNames);
      }
      if (data.teamColors) {
        setTeamColors(data.teamColors);
      }

      setShowScores(data.showScores ?? true);
      setNumTeams(data.numTeams ?? 2);

      return data;
    } catch (error) {
      console.error("Error loading from Firestore:", error);
      throw error;
    }
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
        updatePlayerName, // Add to provider
        updateTeamColor, // Add to provider
        updateTeamName,
        setAllIncluded,
        showScores,
        setShowScores,
        numTeams,
        setNumTeams,
        deletePlayer,
        saveToFirestore,
        loadFromFirestore,
        repulsors,
        addRepulsor,
        removeRepulsor,
        algorithm, // Add algorithm to context
        setAlgorithm, // Add algorithm setter to context
        currentCollection,
        setCurrentCollection,
      }}
    >
      {children}
    </NamesContext.Provider>
  );
};

export const useNames = () => {
  const context = useContext(NamesContext);
  if (!context) {
    throw new Error("useNames must be used within a NamesProvider");
  }
  return context;
};
