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
  algorithm?: string;
  currentCollection?: string; // Add current collection state
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
  listCollections: () => Promise<
    { name: string; lastUpdated: string; hasPassword: boolean }[]
  >;
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

  const [currentCollection, setCurrentCollection] = useState<string>("Players");

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

        // Load currentCollection from storage - fix the logic here
        if (hasData && savedData.currentCollection) {
          console.log(
            "Using saved currentCollection:",
            savedData.currentCollection
          );
          setCurrentCollection(savedData.currentCollection);
        } else if (!hasData && DEMO_DATA.currentCollection) {
          console.log(
            "Using demo currentCollection:",
            DEMO_DATA.currentCollection
          );
          setCurrentCollection(DEMO_DATA.currentCollection);
        } else {
          console.log("Using default currentCollection: Players");
          setCurrentCollection("Players");
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
        // Keep currentCollection as "Players" if demo data doesn't have it
        setCurrentCollection(DEMO_DATA.currentCollection || "Players?");
        setShowScores(DEMO_DATA.showScores);
        setNumTeams(DEMO_DATA.numTeams);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const listCollections = async (): Promise<
    { name: string; lastUpdated: string; hasPassword: boolean }[]
  > => {
    try {
      // Get the collections registry
      const registryDoc = await getDoc(doc(db, "_collections", "registry"));

      if (!registryDoc.exists()) {
        return [];
      }

      const collectionsData = registryDoc.data().collections || [];
      return collectionsData.sort(
        (a: any, b: any) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
    } catch (error) {
      console.error("Error listing collections:", error);
      return [];
    }
  };

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
      currentCollection, // Include currentCollection in saved data
    };

    console.log("Saving data to storage:", { currentCollection }); // Add this debug log
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
    currentCollection, // Add currentCollection to dependency array
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

      const sanitizePlayer = (player: Player): Player => {
        return {
          name: player.name || "Unknown Player", // Fallback for name
          score: typeof player.score === "number" ? player.score : 1, // Default score
          included:
            typeof player.included === "boolean" ? player.included : true, // Default included
          bio: player.bio || "", // Ensure bio is a string, not undefined
          matches: typeof player.matches === "number" ? player.matches : 0, // Default matches
        };
      };

      const processedNames = names
        .map((team, teamIndex) => {
          return team.map((player, playerIndex) => {
            const sanitizedPlayer = sanitizePlayer(player); // Sanitize each player
            return {
              ...sanitizedPlayer,
              teamIndex,
              playerIndex,
            } as FirestorePlayer;
          });
        })
        .flat();

      // Create the data object
      // Define a more specific type if possible, instead of relying on StorageData directly for Firestore
      const dataToSave = {
        players: processedNames,
        teamNames: teamNames || {}, // Ensure teamNames is an object
        teamColors: teamColors || {}, // Ensure teamColors is an object
        showScores,
        numTeams,
        algorithm: algorithm || "scores", // Ensure algorithm is a string
        repulsors: repulsors || [], // Ensure repulsors is an array
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

      const registryRef = doc(db, "_collections", "registry");
      const registryDoc = await getDoc(registryRef);

      const collectionEntry = {
        name: collection,
        hasPassword: !!password,
        lastUpdated: new Date().toISOString(),
      };

      if (registryDoc.exists()) {
        const registryData = registryDoc.data();
        const collections = registryData.collections || [];

        // Remove existing entry with same name if it exists
        const filteredCollections = collections.filter(
          (c: any) => c.name !== collection
        );

        // Add the updated entry
        await setDoc(registryRef, {
          collections: [...filteredCollections, collectionEntry],
        });
      } else {
        // Create new registry with this collection
        await setDoc(registryRef, {
          collections: [collectionEntry],
        });
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

      // Only update currentCollection after successful password verification
      // and when we're actually loading data (not just checking password)
      console.log("Loading collection:", collection);
      setCurrentCollection(collection);

      // Password is correct or not needed, reconstruct data
      // Use numTeams from Firestore data if available, otherwise use current state's numTeams as a fallback
      const numberOfTeamsToReconstruct =
        typeof data.numTeams === "number" ? data.numTeams : numTeams;
      const reconstructedNames: Player[][] = Array(numberOfTeamsToReconstruct)
        .fill(null) // Use null for map to work correctly with empty slots
        .map(() => []);

      if (data.players && Array.isArray(data.players)) {
        (data.players as FirestorePlayer[]).forEach((player) => {
          // Sanitize loaded player data
          const cleanPlayer: Player = {
            name: player.name || "Unknown Player",
            score: typeof player.score === "number" ? player.score : 1,
            included:
              typeof player.included === "boolean" ? player.included : true,
            bio: player.bio || "",
            matches: typeof player.matches === "number" ? player.matches : 0,
          };

          if (
            player.teamIndex >= 0 &&
            player.teamIndex < numberOfTeamsToReconstruct
          ) {
            if (!reconstructedNames[player.teamIndex]) {
              reconstructedNames[player.teamIndex] = []; // Should be redundant due to pre-initialization
            }
            reconstructedNames[player.teamIndex].push(cleanPlayer);
          } else {
            // Handle players with out-of-bounds teamIndex, e.g., add to a default team or log warning
            // For now, let's add to the first team if teamIndex is invalid
            console.warn(
              `Player ${player.name} has invalid teamIndex ${player.teamIndex}. Adding to team 0.`
            );
            if (reconstructedNames[0]) {
              reconstructedNames[0].push(cleanPlayer);
            } else if (numberOfTeamsToReconstruct > 0) {
              reconstructedNames[0] = [cleanPlayer]; // If team 0 was not initialized due to 0 teams
            }
          }
        });
      }

      setNames(reconstructedNames);

      // Load team names and colors if available
      if (data.teamNames) {
        setTeamNames(data.teamNames);
      } else {
        setTeamNames({}); // Reset if not in Firestore data
      }
      if (data.teamColors) {
        setTeamColors(data.teamColors);
      } else {
        setTeamColors({}); // Reset if not in Firestore data
      }
      // Load algorithm and repulsors if available
      if (data.algorithm) {
        setAlgorithm(data.algorithm);
      } else {
        setAlgorithm("scores"); // Reset to default if not in Firestore data
      }
      if (data.repulsors) {
        setRepulsors(data.repulsors);
      } else {
        setRepulsors([]); // Reset if not in Firestore data
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
        listCollections, // Add listCollections to context
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
